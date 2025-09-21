package com.project2.ism.Service;

import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.Users.Role;
import com.project2.ism.Model.Users.User;
import com.project2.ism.Repository.RoleRepository;
import com.project2.ism.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private RoleRepository roleRepository;
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final MailService mailService;

    public UserService(UserRepository userRepository, MailService mailService){
        this.userRepository = userRepository;
        this.mailService = mailService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }
    public Optional<User> loginUser(String email, String password) {
        Optional<User> userFromDb = userRepository.findByEmail(email);
        if (userFromDb.isPresent() && passwordEncoder.matches(password, userFromDb.get().getPassword())) {
            return userFromDb;  // Password is valid
        }
        return Optional.empty();  // Invalid credentials
    }

    public Optional<User> signUpUser(User user, String roleName) {
        Optional<User> existUser = userRepository.findByEmail(user.getEmail());

        if (existUser.isPresent()) {
            return Optional.empty();
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Assign role if provided
        if (roleName != null) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            user.addRole(role);
        }

        User savedUser = userRepository.save(user);
        return Optional.of(savedUser);
    }
    @Transactional
    public void createAndSendCredentials(String email, String roleName, String plainPassword) {
        // 1. If password is null, generate random
        String rawPassword = (plainPassword != null && !plainPassword.isBlank())
                ? plainPassword
                : generateRandomPassword(10);

        // 2. Get or create role
        Role role = getOrCreateRole(roleName);

        // 3. Create User entity
        User user = new User();
        user.setEmail(email);
        user.addRole(role); // Use the new role system
        user.setPassword(passwordEncoder.encode(rawPassword));

        // 4. Save in DB
        userRepository.save(user);

        // 5. Send email
        String loginUrl = "http://localhost:5175/login";
        String message = """
                Hello,
                
                Your account has been created successfully.

                Email: %s
                Password: %s
                Role: %s

                You can login here: %s
                """.formatted(email, rawPassword, roleName, loginUrl);

        mailService.sendEmail(
                List.of(email),
                "Your Account Credentials",
                message
        );
    }
    private Role getOrCreateRole(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(roleName);
                    newRole.setDescription(getDefaultRoleDescription(roleName));
                    return roleRepository.save(newRole);
                });
    }
    private String getDefaultRoleDescription(String roleName) {
        return switch (roleName) {
            case "SUPER_ADMIN" -> "Super Administrator with full system access";
            case "ADMIN" -> "Administrator with limited permissions";
            case "FRANCHISE" -> "Franchise user account";
            case "MERCHANT" -> "Merchant user account";
            default -> "User account";
        };
    }

    public String generateRandomPassword(int length) {
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
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(5)); // 30 min expiry
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

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    // Method to update existing user's role (for franchise/merchant creation)
    @Transactional
    public User updateUserRole(String email, String newRoleName) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Role newRole = getOrCreateRole(newRoleName);

            // Add the new role (keeping existing roles if needed)
            user.addRole(newRole);

            return userRepository.save(user);
        }

        throw new RuntimeException("User not found with email: " + email);
    }
    @Transactional
    public void createOrUpdateCredentials(String email, String roleName, String plainPassword) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            // User exists, just add the new role
            updateUserRole(email, roleName);

            // Optionally send notification email about new role
            String message = """
                Hello,
                
                Your account has been updated with a new role: %s
                
                You can continue using your existing login credentials.
                
                Login here: http://localhost:5175/login
                """.formatted(roleName);

            mailService.sendEmail(
                    List.of(email),
                    "Account Role Updated",
                    message
            );
        } else {
            // Create new user
            createAndSendCredentials(email, roleName, plainPassword);
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
            userRepository.save(user);
            return ResetStatus.SUCCESS;
        }

        return ResetStatus.INVALID;
    }

    public String getPrimaryRoleName(User user) {
        return user.getRoles().stream()
                .findFirst()
                .map(Role::getName)
                .orElse("SUPER_ADMIN");
    }

}
