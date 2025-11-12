package com.project2.ism.Security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project2.ism.Controller.AesController;
import com.project2.ism.DTO.ReportDTO.ApiResponse;
import com.project2.ism.Service.AesService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UrlPathHelper;

import javax.crypto.spec.IvParameterSpec;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Base64;
import java.util.Map;
import java.util.Set;

@Component
public class AesFilter extends OncePerRequestFilter {

    // Paths that REQUIRE AES authentication
    private static final Set<String> AES_PROTECTED_PATHS = Set.of(
            "/external"
    );

    // Public AES endpoints (no auth needed)
    private static final Set<String> AES_PUBLIC_PATHS = Set.of(
            "/aes/generate-token",
            "/aes/encrypt-credentials",
            "/aes/decrypt-credentials",
            "/pg/payment/callback",
            "/payout/callback"
    );

    private static final Logger log = LoggerFactory.getLogger(AesFilter.class);

    @Value("${app.security.base-secret}")
    private String baseSecret;

    @Value("${app.security.pbkdf2-iterations}")
    private int iterations;

    @Value("${app.security.pbkdf2-keylength}")
    private int keyLength;

    private final AesService aesService;

    public AesFilter(AesService aesService) {
        this.aesService = aesService;
    }

    /**
     * Skip this filter for all non-AES paths.
     * Let JwtAuthFilter handle JWT authentication.
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String contextPath = request.getContextPath();
        String relativePath = path.substring(contextPath.length());

        boolean isAesPath = AES_PROTECTED_PATHS.stream().anyMatch(relativePath::startsWith) ||
                AES_PUBLIC_PATHS.stream().anyMatch(relativePath::startsWith);

        log.debug("Path: {} | Is AES path: {} | Will filter: {}",
                relativePath, isAesPath, !isAesPath);

        return !isAesPath; // Skip if NOT an AES path
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String contextPath = request.getContextPath();
        String relativePath = path.substring(contextPath.length());

        log.info("AesFilter executing for: {}", relativePath);

        // Check if public AES endpoint (no token required)
        if (AES_PUBLIC_PATHS.stream().anyMatch(relativePath::startsWith)) {
            log.info("Public AES endpoint, allowing without token");
            filterChain.doFilter(request, response);
            return;
        }

        // For protected AES paths, validate token
        String token = request.getHeader("Authorization");
        if (!StringUtils.hasText(token) || !token.startsWith("Bearer ")) {
            log.error("Missing or invalid AES token for: {}", relativePath);
            throwException(response);
            return;
        }

        token = token.substring(7);

        try {
            String decryptedPayload = decryptToken(token);
            String[] parts = decryptedPayload.split("/");

            if (isTokenExpired(parts[0], parts[1])) {
                log.warn("AES token expired for: {}", relativePath);
                sendErrorResponse(response, 401, "Token expired");
                return;
            }

            log.info("AES authentication successful for user: {}", parts[2]);
            request.setAttribute("aesUsername", parts[2]);
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            log.error("AES token validation failed: {}", e.getMessage());
            throwException(response);
        }
    }

    private String decryptToken(String token) throws Exception {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Missing token");
        }

        String[] parts = token.split("\\|", 3);
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid token format");
        }

        String saltBase64 = parts[0];
        byte[] saltBytes = Base64.getDecoder().decode(saltBase64);

        String ivBase64 = parts[1];
        String encryptedToken = parts[2];

        byte[] derivedKey = aesService.deriveKey(baseSecret, saltBytes, iterations, keyLength);
        IvParameterSpec ivSpec = new IvParameterSpec(Base64.getDecoder().decode(ivBase64));

        return aesService.decrypt(encryptedToken, derivedKey, ivSpec);
    }

    private boolean isTokenExpired(String generationTimestamp, String expirationTimestamp) {
        try {
            long expirationTime = Long.parseLong(expirationTimestamp);
            long currentTime = System.currentTimeMillis();

            if (currentTime > expirationTime) {
                return true;
            }
            return false;
        } catch (NumberFormatException e) {
            log.error("Invalid timestamp format: {}", e.getMessage());
            return true;
        }
    }

    private void sendErrorResponse(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");

        ApiResponse<Object> apiResponse = new ApiResponse<>();
        apiResponse.setMessage(message);
        apiResponse.setData(null);

        PrintWriter writer = response.getWriter();
        writer.write(new ObjectMapper().writeValueAsString(apiResponse));
        writer.flush();
    }

    private void throwException(HttpServletResponse response) throws IOException {
        response.setStatus(401);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Unauthorized request\"}");
    }
}