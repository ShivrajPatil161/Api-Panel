package com.project2.ism.Service;

import com.project2.ism.Model.Users.User;
import com.project2.ism.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {


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

    public Optional<User> signUpUser(User user) {
        Optional<User> existUser = userRepository.findByEmail(user.getEmail());

        if (existUser.isPresent()) {
            return Optional.empty();
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return Optional.of(savedUser);
    }
    @Transactional
    public void createAndSendCredentials(String email, String role, String plainPassword) {
        // 1. If password is null, generate random
        String rawPassword = (plainPassword != null && !plainPassword.isBlank())
                ? plainPassword
                : generateRandomPassword(10);

        // 2. Create User entity
        User user = new User();
        user.setEmail(email);
        user.setRole(role);
        user.setPassword(passwordEncoder.encode(rawPassword));

        // 3. Save in DB
        userRepository.save(user);

        // 4. Send email
        String loginUrl = "http://localhost:5173/login";
        String message = """
                Hello,
                
                Your account has been created successfully.

                Email: %s
                Password: %s

                You can login here: %s
                """.formatted(email, rawPassword, loginUrl);

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
}
