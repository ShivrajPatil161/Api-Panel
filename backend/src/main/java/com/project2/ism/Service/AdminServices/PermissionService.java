package com.project2.ism.Service.AdminServices;

import com.project2.ism.DTO.AdminDTO.CreatePermissionRequest;
import com.project2.ism.Model.Users.Permission;
import com.project2.ism.Model.Users.User;
import com.project2.ism.Repository.PermissionRepository;
import com.project2.ism.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    public Permission createPermission(CreatePermissionRequest request) {
        // Check if permission already exists
        if (permissionRepository.findByName(request.getName()).isPresent()) {
            throw new IllegalArgumentException("Permission already exists: " + request.getName());
        }

        Permission permission = new Permission(request.getName(), request.getDescription());
        return permissionRepository.save(permission);
    }

    public Permission updatePermission(Long id, CreatePermissionRequest request) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        // Check if new name conflicts with existing permission (excluding current one)
        Optional<Permission> existing = permissionRepository.findByName(request.getName());
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            throw new IllegalArgumentException("Permission name already exists: " + request.getName());
        }

        permission.setName(request.getName());
        permission.setDescription(request.getDescription());
        return permissionRepository.save(permission);
    }

    public void deletePermission(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        // UPDATED: Check if permission is being used by any user directly
        List<User> usersUsingPermission = userRepository.findAll().stream()
                .filter(user -> user.getAllPermissions().contains(permission))
                .toList();

        if (!usersUsingPermission.isEmpty()) {
            String userEmails = usersUsingPermission.stream()
                    .map(User::getEmail)
                    .collect(Collectors.joining(", "));
            throw new IllegalStateException("Cannot delete permission. It's being used by users: " + userEmails);
        }

        permissionRepository.delete(permission);
    }

    public List<Permission> getPermissionsByNames(List<String> names) {
        return permissionRepository.findByNameIn(names);
    }
}