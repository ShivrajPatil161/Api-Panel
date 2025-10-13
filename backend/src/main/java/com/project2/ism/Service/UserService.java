package com.project2.ism.Service;

import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.Users.User;
import com.project2.ism.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Value("${security.password.expiry-days:90}")  // ✅ Inject here in the service
    private int passwordExpiryDays;

    public UserService(UserRepository userRepository, MailService mailService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    // ✅ Add new enum for login status
    public enum LoginStatus {
        SUCCESS,
        INVALID_CREDENTIALS,
        PASSWORD_EXPIRED
    }

    // ✅ Updated login method to check password expiry
    public LoginResult loginUser(String email, String password) {
        Optional<User> userFromDb = userRepository.findByEmail(email);

        if (userFromDb.isEmpty()) {
            return new LoginResult(LoginStatus.INVALID_CREDENTIALS, null);
        }

        User user = userFromDb.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return new LoginResult(LoginStatus.INVALID_CREDENTIALS, null);
        }

        // ✅ Check if password has expired
        if (user.isPasswordExpired()) {
            return new LoginResult(LoginStatus.PASSWORD_EXPIRED, user);
        }

        return new LoginResult(LoginStatus.SUCCESS, user);
    }

    // ✅ Helper class to return both status and user
    public static class LoginResult {
        private final LoginStatus status;
        private final User user;

        public LoginResult(LoginStatus status, User user) {
            this.status = status;
            this.user = user;
        }

        public LoginStatus getStatus() {
            return status;
        }

        public User getUser() {
            return user;
        }
    }

    public Optional<User> signUpUser(User user) {
        Optional<User> existUser = userRepository.findByEmail(user.getEmail());

        if (existUser.isPresent()) {
            return Optional.empty();
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // ✅ Set password expiry for new users
        user.setPasswordLastChangedAt(LocalDateTime.now());
        user.setPasswordExpiryDate(LocalDateTime.now().plusDays(passwordExpiryDays));

        User savedUser = userRepository.save(user);
        return Optional.of(savedUser);
    }

    @Transactional
    public void createAndSendCredentials(String email, String role, String plainPassword) {
        String rawPassword = (plainPassword != null && !plainPassword.isBlank())
                ? plainPassword
                : generateRandomPassword(10);

        User user = new User();
        user.setEmail(email);
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(rawPassword));

        // ✅ Set password expiry for admin-created users
        user.setPasswordLastChangedAt(LocalDateTime.now());
        user.setPasswordExpiryDate(LocalDateTime.now().plusDays(passwordExpiryDays));

        userRepository.save(user);

        String loginUrl = "http://localhost:5175/login";
        String message = """
                Hello,
                
                Your account has been created successfully.

                Email: %s
                Password: %s

                You can login here: %s
                
                Note: Your password will expire in %d days.
                """.formatted(email, rawPassword, loginUrl, passwordExpiryDays);

        mailService.sendEmail(
                List.of(email),
                "Your Account Credentials",
                message
        );
    }

    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public void generateResetToken(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = UUID.randomUUID().toString();

            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);

            String resetLink = "http://localhost:5175/reset-password?token=" + token;
            mailService.sendEmail(
                    List.of(user.getEmail()),
                    "Password Reset Request",
                    "Click here to reset password: " + resetLink
            );
        } else {
            throw new ResourceNotFoundException("No user found with this email");
        }
    }

    public enum ResetStatus {
        SUCCESS,
        EXPIRED,
        INVALID
    }

    @Transactional
    public ResetStatus resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetToken(token);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                return ResetStatus.EXPIRED;
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);

            // ✅ Set password expiry and last changed timestamp
            user.setPasswordLastChangedAt(LocalDateTime.now());
            user.setPasswordExpiryDate(LocalDateTime.now().plusDays(passwordExpiryDays));

            userRepository.save(user);
            return ResetStatus.SUCCESS;
        }

        return ResetStatus.INVALID;
    }

    public enum ChangePasswordStatus {
        SUCCESS,
        USER_NOT_FOUND,
        INVALID_CURRENT_PASSWORD,
        SAME_PASSWORD,
        NOT_FIRST_LOGIN
    }

    @Transactional
    public ChangePasswordStatus changePassword(String email, String currentPassword, String newPassword, boolean isFirstLogin) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ChangePasswordStatus.USER_NOT_FOUND;
        }

        User user = userOptional.get();

        // ✅ Validate first login
        if (isFirstLogin && !user.isFirstLogin()) {
            return ChangePasswordStatus.NOT_FIRST_LOGIN;
        }

        // ✅ Validate current password if not first login
        if (!isFirstLogin) {
            if (currentPassword == null || currentPassword.isBlank()) {
                return ChangePasswordStatus.INVALID_CURRENT_PASSWORD;
            }

            if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                return ChangePasswordStatus.INVALID_CURRENT_PASSWORD;
            }

            if (passwordEncoder.matches(newPassword, user.getPassword())) {
                return ChangePasswordStatus.SAME_PASSWORD;
            }
        }

        // ✅ Update password and expiry
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordLastChangedAt(LocalDateTime.now());
        user.setPasswordExpiryDate(LocalDateTime.now().plusDays(passwordExpiryDays));

        if (isFirstLogin && user.isFirstLogin()) {
            user.setFirstLogin(false);
        }

        userRepository.save(user);

        return ChangePasswordStatus.SUCCESS;
    }
}