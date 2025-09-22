package com.project2.ism.Service.AdminServices;

import com.project2.ism.DTO.AdminDTO.CreateAdminRequest;
import com.project2.ism.Model.Users.Permission;
import com.project2.ism.Model.Users.User;
import com.project2.ism.Repository.UserRepository;
import com.project2.ism.Service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminService {


    private final UserRepository userRepository;


    private final UserService userService;


    private final PermissionService permissionService;


    private final PasswordEncoder passwordEncoder;

    public AdminService(UserRepository userRepository, UserService userService, PermissionService permissionService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.permissionService = permissionService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User createAdmin(CreateAdminRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User already exists with email: " + request.getEmail());
        }

        List<Permission> requestedPermissions = permissionService.getPermissionsByNames(request.getPermissionNames());
        if (requestedPermissions.size() != request.getPermissionNames().size()) {
            throw new IllegalArgumentException("Some permissions not found");
        }



        // Use the method that sends credentials
        userService.createAndSendCredentials(request.getEmail(), "ADMIN", null);

        // Fetch the saved user (or construct manually)
        User admin = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // Assign permissions
        for (Permission permission : requestedPermissions) {
            admin.addPermission(permission);
        }

        return userRepository.save(admin);
    }


    public User updateAdminPermissions(Long userId, List<String> permissionNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify user is an admin
        if (!"ADMIN".equals(user.getRole()) && !"SUPER_ADMIN".equals(user.getRole())) {
            throw new IllegalArgumentException("User is not an admin");
        }

        // Don't allow modifying SUPER_ADMIN permissions
        if ("SUPER_ADMIN".equals(user.getRole())) {
            throw new IllegalArgumentException("Cannot modify SUPER_ADMIN permissions");
        }

        // Get requested permissions
        List<Permission> requestedPermissions = permissionService.getPermissionsByNames(permissionNames);
        if (requestedPermissions.size() != permissionNames.size()) {
            throw new IllegalArgumentException("Some permissions not found");
        }

        // Clear existing permissions and add new ones
        user.getAllPermissions().clear();
        for (Permission permission : requestedPermissions) {
            user.addPermission(permission);
        }

        return userRepository.save(user);
    }

    public List<User> getAllAdmins() {
        return userRepository.findByRole("ADMIN"); // Use repository method
    }

    public void deleteAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Don't allow deleting SUPER_ADMIN
        if ("SUPER_ADMIN".equals(user.getRole())) {
            throw new IllegalArgumentException("Cannot delete SUPER_ADMIN");
        }

        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalArgumentException("User is not an admin");
        }

        userRepository.delete(user);
    }

    // Method to get current user's permissions (for JWT integration later)
    public List<Permission> getCurrentUserPermissions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getAllPermissions().stream().toList();
    }
}