package com.project2.ism.Repository;

import com.project2.ism.Model.Users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);

    List<User> findByEmailIn(List<String> emails);

    // NEW: Find users by role
    List<User> findByRole(String role);

    // NEW: Find users by role with permissions (for efficiency if needed later)
    @Query("SELECT u FROM User u JOIN FETCH u.permissions WHERE u.role = :role")
    List<User> findByRoleWithPermissions(@Param("role") String role);

//    @Query("SELECT u.email FROM User u WHERE u.role = :role")
//    List<String> findEmailByRole(@Param("role") String role);
}
