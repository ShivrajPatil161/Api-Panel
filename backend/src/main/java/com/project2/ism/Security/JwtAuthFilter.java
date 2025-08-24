//package com.project2.ism.Security;
//
//import com.project2.ism.Service.JwtService;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import java.io.IOException;
//import java.util.Collections;
//import java.util.List;
//
//@Component
//public class JwtAuthFilter extends OncePerRequestFilter {
//
//    private final JwtService jwtService;
//
//    public JwtAuthFilter(JwtService jwtService) {
//        this.jwtService = jwtService;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain)
//            throws ServletException, IOException {
//
//        final String authHeader = request.getHeader("Authorization");
//
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        String token = authHeader.substring(7);
//        String email = null;
//
//        try {
//            email = jwtService.extractEmail(token);
//
//            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                if (jwtService.validateToken(token, email)) {
//                    String role = jwtService.extractRole(token);
//                    System.out.println(role);
//                    List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
//
//                    UsernamePasswordAuthenticationToken authToken =
//                            new UsernamePasswordAuthenticationToken(email, null, authorities);
//                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                    SecurityContextHolder.getContext().setAuthentication(authToken);
//                }
//            }
//
//            filterChain.doFilter(request, response);
//
//        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
//            // Logging
//            logger.warn("JWT expired: {}");
//
//            // Custom JSON response
//            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//            response.setContentType("application/json");
//            response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
//            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//            response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
//            response.setHeader("Access-Control-Allow-Credentials", "true");
//            String json = String.format("""
//                {
//                  "timestamp": "%s",
//                  "status": 401,
//                  "error": "Unauthorized",
//                  "message": "JWT token has expired. Please login again.",
//                  "path": "%s"
//                }
//                """, java.time.LocalDateTime.now(), request.getRequestURI());
//
//            response.getWriter().write(json);
//
//        } catch (Exception ex) {
//            // Catch-all fallback
//            logger.error("JWT filter error: {}");
//
//            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//            response.setContentType("application/json");
//            String json = String.format("""
//                {
//                  "timestamp": "%s",
//                  "status": 500,
//                  "error": "Internal Server Error",
//                  "message": "%s",
//                  "path": "%s"
//                }
//                """, java.time.LocalDateTime.now(), ex.getMessage(), request.getRequestURI());
//
//            response.getWriter().write(json);
//        }
//    }
//
//}


package com.project2.ism.Security;

import com.project2.ism.Service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthFilter.class);
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final ObjectMapper objectMapper;

    public JwtAuthFilter(JwtService jwtService, ObjectMapper objectMapper) {
        this.jwtService = jwtService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String token = extractTokenFromRequest(request);

            if (!StringUtils.hasText(token)) {
                filterChain.doFilter(request, response);
                return;
            }

            String email = jwtService.extractEmail(token);

            if (StringUtils.hasText(email) && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.validateToken(token, email)) {
                    String role = jwtService.extractRole(token);

                    logger.debug("Authenticating user: {} with role: {}", email, role);

                    // Ensure role has proper prefix
                    String normalizedRole = normalizeRole(role);
                    List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(normalizedRole));

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(email, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    logger.debug("Successfully authenticated user: {} with authorities: {}", email, authorities);
                } else {
                    logger.warn("Invalid token for user: {}", email);
                }
            }

            filterChain.doFilter(request, response);

        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            logger.warn("JWT token expired for request: {}", request.getRequestURI());
            handleJwtException(response, request, "JWT token has expired. Please login again.",
                    HttpServletResponse.SC_UNAUTHORIZED);

        } catch (io.jsonwebtoken.SignatureException ex) {
            logger.error("Invalid JWT signature for request: {}", request.getRequestURI());
            handleJwtException(response, request, "Invalid token signature.",
                    HttpServletResponse.SC_UNAUTHORIZED);

        } catch (io.jsonwebtoken.MalformedJwtException ex) {
            logger.error("Malformed JWT token for request: {}", request.getRequestURI());
            handleJwtException(response, request, "Malformed token.",
                    HttpServletResponse.SC_UNAUTHORIZED);

        } catch (Exception ex) {
            logger.error("JWT filter error for request: {} - Error: {}",
                    request.getRequestURI(), ex.getMessage(), ex);
            handleJwtException(response, request, "Authentication error occurred.",
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (StringUtils.hasText(authHeader) && authHeader.startsWith(BEARER_PREFIX)) {
            return authHeader.substring(BEARER_PREFIX.length());
        }

        return null;
    }

    private String normalizeRole(String role) {
        if (role == null) {
            return "ROLE_USER";
        }

        String upperRole = role.toUpperCase();
        return upperRole.startsWith("ROLE_") ? upperRole : "ROLE_" + upperRole;
    }

    private void handleJwtException(HttpServletResponse response,
                                    HttpServletRequest request,
                                    String message,
                                    int status) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");

        // Set CORS headers
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5175");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now().toString());
        errorResponse.put("status", status);
        errorResponse.put("error", status == 401 ? "Unauthorized" : "Internal Server Error");
        errorResponse.put("message", message);
        errorResponse.put("path", request.getRequestURI());

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
        response.getWriter().flush();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        // Skip JWT validation for public endpoints
        return path.equals("/users/login") ||
                path.equals("/users/signup") ||
                path.startsWith("/actuator/health") ||
                request.getMethod().equals("OPTIONS");
    }
}