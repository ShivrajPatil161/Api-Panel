package com.project2.ism.Security;

import java.util.Set;

public class AesPathConstants {

    // Paths that REQUIRE AES authentication
    public static final Set<String> AES_PROTECTED_PATHS = Set.of(
            "/external",
            "/pg/create-order"
    );

    // Public AES endpoints (no auth needed)
    public static final Set<String> AES_PUBLIC_PATHS = Set.of(
            "/aes/generate-token",
            "/aes/encrypt-credentials",
            "/aes/decrypt-credentials",
            "/pg/payment/callback",
            "/payout/callback"
    );

    private AesPathConstants() {
        // Prevent instantiation
    }
}