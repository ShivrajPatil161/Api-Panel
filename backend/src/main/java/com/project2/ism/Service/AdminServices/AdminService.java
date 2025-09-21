package com.project2.ism.Service.AdminServices;

import com.project2.ism.DTO.AdminDTO.CreateAdminRequest;
import com.project2.ism.Model.Users.Permission;
import com.project2.ism.Model.Users.Role;
import com.project2.ism.Model.Users.User;
import com.project2.ism.Repository.RoleRepository;
import com.project2.ism.Repository.UserRepository;
import com.project2.ism.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// 5. Admin Management Service
@Service
@Transactional
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionService permissionService;



    public User createAdmin(CreateAdminRequest request) {
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User already exists with email: " + request.getEmail());
        }

        // Get or create ADMIN role
        Role adminRole = getOrCreateAdminRole();

        // Get requested permissions
        List<Permission> requestedPermissions = permissionService.getPermissionsByNames(request.getPermissionNames());

        if (requestedPermissions.size() != request.getPermissionNames().size()) {
            throw new IllegalArgumentException("Some permissions not found");
        }
        String rawPassword = userService.generateRandomPassword(10);
        // Create new admin user
        User admin = new User(request.getEmail(),rawPassword);
        admin.addRole(adminRole);

        // Clear existing permissions and add new ones
        adminRole.getPermissions().clear();
        for (Permission permission : requestedPermissions) {
            adminRole.addPermission(permission);
        }

        return userRepository.save(admin);
    }

    public User updateAdminPermissions(Long userId, List<String> permissionNames) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify user is an admin
        if (!user.hasRole("ADMIN") && !user.hasRole("SUPER_ADMIN")) {
            throw new IllegalArgumentException("User is not an admin");
        }

        // Don't allow modifying SUPER_ADMIN permissions
        if (user.hasRole("SUPER_ADMIN")) {
            throw new IllegalArgumentException("Cannot modify SUPER_ADMIN permissions");
        }

        // Get requested permissions
        List<Permission> requestedPermissions = permissionService.getPermissionsByNames(permissionNames);

        if (requestedPermissions.size() != permissionNames.size()) {
            throw new IllegalArgumentException("Some permissions not found");
        }

        // Update admin role permissions for this user
        Role adminRole = user.getRoles().stream()
                .filter(role -> role.getName().equals("ADMIN"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Admin role not found"));

        adminRole.getPermissions().clear();
        for (Permission permission : requestedPermissions) {
            adminRole.addPermission(permission);
        }

        return userRepository.save(user);
    }

    public List<User> getAllAdmins() {
        return userRepository.findAll().stream()
                .filter(user -> user.hasRole("ADMIN") || user.hasRole("SUPER_ADMIN"))
                .collect(Collectors.toList());
    }

    public void deleteAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Don't allow deleting SUPER_ADMIN
        if (user.hasRole("SUPER_ADMIN")) {
            throw new IllegalArgumentException("Cannot delete SUPER_ADMIN");
        }

        if (!user.hasRole("ADMIN")) {
            throw new IllegalArgumentException("User is not an admin");
        }

        userRepository.delete(user);
    }

    private Role getOrCreateAdminRole() {
        return roleRepository.findByName("ADMIN")
                .orElseGet(() -> {
                    Role adminRole = new Role("ADMIN", "Administrator with specific permissions");
                    return roleRepository.save(adminRole);
                });
    }
}
