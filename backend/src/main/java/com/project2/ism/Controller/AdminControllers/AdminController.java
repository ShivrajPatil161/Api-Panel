package com.project2.ism.Controller.AdminControllers;

import com.project2.ism.DTO.AdminDTO.CreateAdminRequest;
import com.project2.ism.Model.Users.User;
import com.project2.ism.Service.AdminServices.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/admins")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<List<User>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @PostMapping
    public ResponseEntity<User> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        User admin = adminService.createAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(admin);
    }

    @PutMapping("/{userId}/permissions")
    public ResponseEntity<User> updateAdminPermissions(
            @PathVariable Long userId,
            @RequestBody List<String> permissionNames) {
        User admin = adminService.updateAdminPermissions(userId, permissionNames);
        return ResponseEntity.ok(admin);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long userId) {
        adminService.deleteAdmin(userId);
        return ResponseEntity.noContent().build();
    }
}
