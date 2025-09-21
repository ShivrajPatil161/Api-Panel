package com.project2.ism.Controller;

import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.Users.User;
import com.project2.ism.Service.JwtService;
import com.project2.ism.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    JwtService jwtService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> authenticatedUser = userService.loginUser(user.getEmail(), user.getPassword());

        if (authenticatedUser.isPresent()) {
            User loggedInUser = authenticatedUser.get();

            // Get primary role name for JWT token
            String primaryRole = userService.getPrimaryRoleName(loggedInUser);

            // Generate token with primary role
            String token = jwtService.generateToken(loggedInUser.getEmail(), primaryRole);

            // Prepare response with all roles and permissions
            Map<String, Object> response = new HashMap<>();
            response.put("email", loggedInUser.getEmail());
            response.put("role", primaryRole); // For backward compatibility
            response.put("roles", loggedInUser.getRoles().stream()
                    .map(role -> Map.of(
                            "name", role.getName(),
                            "permissions", role.getPermissions().stream()
                                    .map(permission -> Map.of(
                                            "name", permission.getName(),
                                            "description", permission.getDescription()
                                    ))
                                    .collect(Collectors.toList())
                    ))
                    .collect(Collectors.toList()));
            response.put("token", token);
            response.put("message", "Login successful");

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid Credentials"));
        }
    }
    @PostMapping("/signup")
    public ResponseEntity<?> signUser(@RequestBody Map<String, Object> request) {
        User user = new User();
        user.setEmail((String) request.get("email"));
        user.setPassword((String) request.get("password"));

        String roleName = (String) request.get("roleName"); // Add roleName to request

        Optional<User> result = userService.signUpUser(user, roleName);

        if (result.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "email", result.get().getEmail()
            ));
        } else {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "User already exists"));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        try {
            userService.generateResetToken(email);
            return ResponseEntity.ok("Password reset link sent to your email.");
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with this email.");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong.");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        try {
            UserService.ResetStatus status = userService.resetPassword(token, newPassword);

            return switch (status) {
                case SUCCESS -> ResponseEntity.ok("Password reset successful.");
                case EXPIRED -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Reset token expired.");
                case INVALID -> ResponseEntity.badRequest().body("Invalid reset token.");
            };
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong.");
        }
    }

}
