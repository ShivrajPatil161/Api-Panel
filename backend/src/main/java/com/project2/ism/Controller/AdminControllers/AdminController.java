package com.project2.ism.Controller.AdminControllers;

import com.project2.ism.DTO.AdminDTO.CreateAdminRequest;
import com.project2.ism.Model.Users.Permission;
import com.project2.ism.Model.Users.User;
import com.project2.ism.Service.AdminServices.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Only SUPER_ADMIN can manage other admins
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<User>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or (hasRole('ADMIN') and hasAuthority('CREATE_ADMIN'))")
    public ResponseEntity<User> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        User admin = adminService.createAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(admin);
    }

    @PutMapping("/{userId}/permissions")
    @PreAuthorize("hasRole('SUPER_ADMIN') and hasAuthority('MANAGE_ADMIN_PERMISSIONS')")
    public ResponseEntity<User> updateAdminPermissions(
            @PathVariable Long userId,
            @RequestBody List<String> permissionNames) {
        User admin = adminService.updateAdminPermissions(userId, permissionNames);
        return ResponseEntity.ok(admin);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN') and hasAuthority('DELETE_ADMIN')")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long userId) {
        adminService.deleteAdmin(userId);
        return ResponseEntity.noContent().build();
    }

    // NEW: Get current user's permissions (JWT-based)
    @GetMapping("/my-permissions")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<Permission>> getMyPermissions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName(); // Get email from JWT
        List<Permission> permissions = adminService.getCurrentUserPermissions(userEmail);
        return ResponseEntity.ok(permissions);
    }
}