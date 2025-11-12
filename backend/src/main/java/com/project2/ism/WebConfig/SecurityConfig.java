package com.project2.ism.WebConfig;

import com.project2.ism.Security.AesFilter;
import com.project2.ism.Security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AesFilter aesFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, AesFilter aesFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.aesFilter = aesFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints (no auth needed)
                        .requestMatchers("/users/**").permitAll()
                        //.requestMatchers("/actuator/health").permitAll()

                        // AES-protected external API endpoints (already handled by AesFilter)
                        .requestMatchers("/api/aes/**").permitAll() // AesFilter will handle auth
                        .requestMatchers("/api/external/**").permitAll() // Your external APIs




                        // All other requests require JWT authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Filter order matters! AesFilter checks external APIs first
                .addFilterBefore(aesFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        // Config for internal frontend (strict CORS)
        CorsConfiguration internalConfig = new CorsConfiguration();
        internalConfig.setAllowCredentials(true);
        internalConfig.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5175",
                "http://103.93.97.204:5173"
                // Add production frontend domain
        ));
        internalConfig.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin"
        ));
        internalConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // Config for external API (open CORS, but AES-protected)
        CorsConfiguration externalConfig = new CorsConfiguration();
        externalConfig.setAllowedOrigins(List.of("*")); // Allow all origins
        externalConfig.setAllowedHeaders(List.of("*"));
        externalConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // No credentials for external APIs
        externalConfig.setAllowCredentials(false);

        // Apply configurations
        source.registerCorsConfiguration("/api/external/**", externalConfig);
        source.registerCorsConfiguration("/api/aes/**", externalConfig);
        source.registerCorsConfiguration("/**", internalConfig); // Default for all other endpoints

        return source;
    }
}