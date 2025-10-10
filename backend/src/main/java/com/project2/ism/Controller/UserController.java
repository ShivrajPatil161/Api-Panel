package com.project2.ism.Controller;

import com.project2.ism.DTO.AdminDTO.PermissionDTO;
import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.Users.User;
import com.project2.ism.Service.AdminServices.AdminService;
import com.project2.ism.Service.JwtService;
import com.project2.ism.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    JwtService jwtService;

    @Autowired
    private UserService userService;
    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> authenticatedUser = userService.loginUser(user.getEmail(), user.getPassword());

        if (authenticatedUser.isPresent()) {
            User loggedInUser = authenticatedUser.get();
            String token = jwtService.generateToken(loggedInUser.getEmail(), loggedInUser.getRole());

            Map<String, Object> response = new HashMap<>();
            response.put("email", loggedInUser.getEmail());
            response.put("role", loggedInUser.getRole());
            response.put("token", token);
            response.put("message", "Login successful");

            // Only admins need hierarchical permissions
            if ("ADMIN".equalsIgnoreCase(loggedInUser.getRole())
                    || "SUPER_ADMIN".equalsIgnoreCase(loggedInUser.getRole())) {
                List<PermissionDTO> permissions =
                        adminService.getCurrentUserPermissions(loggedInUser.getEmail());
                response.put("permissions", permissions);
            }

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid Credentials"));
        }
    }


    @PostMapping("/signup")
    public ResponseEntity<?> signUser(@RequestBody User user) {
        Optional<User> result = userService.signUpUser(user);

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

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            // Validate input
            if (email == null || email.isBlank() ||
                    currentPassword == null || currentPassword.isBlank() ||
                    newPassword == null || newPassword.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "All fields are required"));
            }

            if (newPassword.length() < 8) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "New password must be at least 8 characters "));
            }

            UserService.ChangePasswordStatus status =
                    userService.changePassword(email, currentPassword, newPassword);

            return switch (status) {
                case SUCCESS -> ResponseEntity.ok(Map.of("message", "Password changed successfully"));
                case USER_NOT_FOUND -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
                case INVALID_CURRENT_PASSWORD -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Current password is incorrect"));
                case SAME_PASSWORD -> ResponseEntity.badRequest()
                        .body(Map.of("error", "New password must be different from current password"));
            };
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong"));
        }
    }

}