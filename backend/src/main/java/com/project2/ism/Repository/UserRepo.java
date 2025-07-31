package com.project2.ism.Repository;

import com.project2.ism.Model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo {

    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);

    List<User> findByEmailIn(List<String> emails);

    @Query("SELECT u.email FROM User u WHERE u.role = :role")
    List<String> findEmailByRole(@Param("role") String role);
}
