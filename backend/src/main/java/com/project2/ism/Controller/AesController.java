//package com.project2.ism.Controller;
//
//import com.project2.ism.Repository.ApiPartnerCredentialsRepository;
//import com.project2.ism.Repository.UserRepository;
//import com.project2.ism.Security.AesFilter;
//import com.project2.ism.Service.AesService;
//import jakarta.annotation.PostConstruct;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.crypto.SecretKeyFactory;
//import javax.crypto.spec.IvParameterSpec;
//import javax.crypto.spec.PBEKeySpec;
//import java.nio.charset.StandardCharsets;
//import java.security.SecureRandom;
//import java.security.spec.KeySpec;
//import java.util.Base64;
//import java.util.Map;
//import java.util.Optional;
//
//
//@RestController
//@RequestMapping("/api/aes")
//public class AesController {
//
//
//
//
//    @Value("${app.security.base-secret}")
//    private String baseSecret;
//
//    @Value("${app.security.pbkdf2-iterations}")
//    private int iterations;
//
//    @Value("${app.security.pbkdf2-keylength}")
//    private int keyLength;
//
//    private static final String SALT_KEY = "j8cLQbZTrMDQnNhu";
//
//    private static final Map<String, String> HIERARCHY_SALTS = Map.of("RT", "nP4jXs9mQwU2dT8v",        // Retailer
//            "DT", "fG9kRz1bYpV8jQwT",        // Distributor
//            "PT", "hD1fL9zWjT4gM7pR",        // Partner
//            "SD", "sZ7dEx2kLwV3tQrM",        // SuperDistributor
//            "WL", "kL7tF1yXsQp3vJbW",        // Whitelabel
//            "ET", "dP5mSzR2xTgWq4Bv",        // Enterprise
//            "AD", "j5vR6fTpCq9LzH2b"        // Admin
//    );
//
//    private byte[] defaultSecretKey;
//
//    private final UserRepository userRepository;
//    private final ApiPartnerCredentialsRepository apiPartnerCredentialsRepository;
//    private final PasswordEncoder passwordEncoder;
//    private final AesService aesService;
//
//    private static final Logger log = LoggerFactory.getLogger(AesController.class);
//
//    public AesController(UserRepository userRepository, ApiPartnerCredentialsRepository apiPartnerCredentialsRepository, PasswordEncoder passwordEncoder, AesService aesService) {
//        this.userRepository = userRepository;
//        this.apiPartnerCredentialsRepository = apiPartnerCredentialsRepository;
//        this.passwordEncoder = passwordEncoder;
//        this.aesService = aesService;
//    }
//
//    @PostConstruct
//    public void init() {
//        // Initialize the default key using the fallback SALT_KEY
//        this.defaultSecretKey = generateSecretKey(baseSecret, SALT_KEY, iterations, keyLength);
//        log.info("Default AES secret key initialized.");
//    }
//
//    /**
//     * Returns the default AES secret key.
//     */
//    public byte[] getSecretKey() {
//        if (this.defaultSecretKey == null) {
//            throw new IllegalStateException("Secret key is not initialized.");
//        }
//        log.info("SecretKey --------->" + defaultSecretKey);
//        return this.defaultSecretKey;
//    }
//
//    /**
//     * Returns a specific AES secret key based on hierarchy type (e.g., RT, DT, PT).
//     */
//    public byte[] getSecretKeyForHierarchy(String hierarchyCode) {
//        String salt = HIERARCHY_SALTS.getOrDefault(hierarchyCode, SALT_KEY);
//        return generateSecretKey(baseSecret, salt, iterations, keyLength);
//    }
//
//    /**
//     * Generates a secret key using PBKDF2.
//     */
//    private byte[] generateSecretKey(String baseSecret, String salt, int iterations, int keyLength) {
//        try {
//            SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
//            KeySpec spec = new PBEKeySpec(baseSecret.toCharArray(), salt.getBytes(StandardCharsets.UTF_8), iterations, keyLength);
//            return factory.generateSecret(spec).getEncoded();
//        } catch (Exception e) {
//            log.error("Error generating secret key: {}", e.getMessage(), e);
//            throw new RuntimeException("Failed to generate secret key", e);
//        }
//    }
//
//    @PostMapping("/generate-token")
//    public ResponseEntity<?> generateToken(@RequestBody TokenGenerationRequest tokenGenerationRequest) {
//        try {
//            // 1 Generate salt & IV
//            byte[] saltBytes = Base64.getDecoder().decode(tokenGenerationRequest.getSalt());
//            byte[] userPassIvBytes = Base64.getDecoder().decode(tokenGenerationRequest.getIvBase64());
//            IvParameterSpec userPassIv = new IvParameterSpec(userPassIvBytes);
//
//            // 2 Derive key
//            byte[] tokenDerivedKey = aesService.deriveKey(baseSecret, saltBytes, iterations, keyLength);
//
//            // 3 Decrypt username/password
//            String decryptedUsername = aesService.decrypt(
//                    tokenGenerationRequest.getUsername(), tokenDerivedKey, userPassIv);
//            String decryptedPassword = aesService.decrypt(
//                    tokenGenerationRequest.getPassword(), tokenDerivedKey, userPassIv);
//
//            // 4 Validate user/password (your existing code)
//            Optional<ApiPartnerCredentials> optionalUser = apiPartnerCredentialsRepository.findByUsername(decryptedUsername);
//            if (optionalUser.isEmpty()) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("error", "Invalid credentials"));
//            }
//            ApiPartnerCredentials apiPartnerCredentials = optionalUser.get();
//            String rawPassword = decryptedPassword;
//            String storedPassword = apiPartnerCredentials.getPassword();
//
//            boolean passwordOk = passwordEncoder.matches(rawPassword, storedPassword)
//                    || rawPassword.equals(storedPassword);
//
//            if (!passwordOk) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("error", "Invalid credentials"));
//            }
//
//
//            // 5 Build payload
//            long currentTime = System.currentTimeMillis();
//            long expirationTime = currentTime + 3600_000L;
//            String payload = currentTime + "/" + expirationTime + "/" + apiPartnerCredentials.getUsername();
//
//            // 6 Encrypt payload
//            IvParameterSpec tokenIv = aesService.generateIv();
//            String encryptedToken = aesService.encrypt(payload, tokenDerivedKey, tokenIv);
//
//            // 7 Combine everything you’ll need later to decrypt:
//            // hierarchyCode|saltBase64|ivBase64|encryptedToken
//            String fullToken = tokenGenerationRequest.getSalt() + "|" +
//                    Base64.getEncoder().encodeToString(tokenIv.getIV()) + "|" +
//                    encryptedToken;
//
//            return ResponseEntity.ok(Map.of(
//                    "token", fullToken,
//                    "expiresAt", expirationTime
//            ));
//        } catch (Exception e) {
//            log.error("Error generating token", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "Error generating token: " + e.getMessage()));
//        }
//    }
////
////
////	@PostMapping("/validate-token")
////	public ResponseEntity<?> validateToken(@RequestBody VerifyTokenRequestDto verifyTokenRequestDto) {
////
////		String hierarchyType = verifyTokenRequestDto.getHierarchyType();
////		String token = verifyTokenRequestDto.getToken();
////
////		try {
////			String salt = HIERARCHY_SALTS.getOrDefault(hierarchyType, "defaultSalt");
////			byte[] derivedKey = AESEncryptionUtil.deriveKey(baseSecret, salt, iterations, keyLength);
////
////			log.info("Received token: {}", token);
////			String decryptedPayload = AESEncryptionUtil.decryptEnterprises(token, derivedKey);
////			String[] parts = decryptedPayload.split("/");
////
////			long issuedAt = Long.parseLong(parts[0]);
////			long expiresAt = Long.parseLong(parts[1]);
////			String username = parts[2];
////
////			if (System.currentTimeMillis() > expiresAt) {
////				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
////						.body("Token has expired.");
////			}
////
////			return ResponseEntity.ok(Map.of(
////					"username", username,
////					"issuedAt", issuedAt,
////					"expiresAt", expiresAt
////			));
////		} catch (Exception e) {
////			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
////					.body("Invalid token: " + e.getMessage());
////		}
////	}
//
//    @PostMapping("/encrypt-credentials")
//    public ResponseEntity<?> encryptCredentials(@RequestBody EncryptDecryptCredentialsDto encryptDecryptCredentialsDto ) {
//        try {
//            // 1. Generate raw salt bytes
//            byte[] saltBytes = new byte[16];
//            new SecureRandom().nextBytes(saltBytes);
//            String saltBase64 = Base64.getEncoder().encodeToString(saltBytes); // send to client
//
//            // 2. Generate IV
//            IvParameterSpec iv = aesService.generateIv();
//            String ivBase64 = Base64.getEncoder().encodeToString(iv.getIV());
//
//            // 3. Derive key from raw salt bytes
//            byte[] derivedKey = aesService.deriveKey(baseSecret, saltBytes, iterations, keyLength);
//
//            // 4. Encrypt using derived key + IV
//            String encryptedUsername = aesService.encrypt(encryptDecryptCredentialsDto.getUsername(), derivedKey, iv );
//            String encryptedPassword = aesService.encrypt(encryptDecryptCredentialsDto.getPassword(), derivedKey, iv );
//
//            return ResponseEntity.ok(Map.of(
//                    "cipherUsername", encryptedUsername,
//                    "cipherPassword", encryptedPassword,
//                    "salt", saltBase64,   // send base64 salt to client
//                    "iv", ivBase64
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", e.getMessage()));
//        }
//    }
//
//    @PostMapping("/decrypt-credentials")
//    public ResponseEntity<?> decryptCredentials(@RequestBody DecryptCredentialsDto decryptCredentials) {
//        try {
//            // 1️ IV decode
//            byte[] ivBytes = Base64.getDecoder().decode(decryptCredentials.getIv());
//            IvParameterSpec ivSpec = new IvParameterSpec(ivBytes);
//
//            byte[] saltByte = Base64.getDecoder().decode(decryptCredentials.getSalt());
//
//
//            // 3️ Derive AES key using decoded salt
//            byte[] secretKey = aesService.deriveKey(
//                    baseSecret,
//                    saltByte,
//                    iterations,
//                    keyLength
//            );
//
//            // 4️ Decrypt username & password
//            String decryptedUsername = aesService.decrypt(decryptCredentials.getUsername(), secretKey, ivSpec);
//            String decryptedPassword = aesService.decrypt(decryptCredentials.getPassword(), secretKey, ivSpec);
//
//            return ResponseEntity.ok(Map.of(
//                    "username", decryptedUsername,
//                    "password", decryptedPassword
//            ));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("error", e.getMessage()));
//        }
//    }
//}
