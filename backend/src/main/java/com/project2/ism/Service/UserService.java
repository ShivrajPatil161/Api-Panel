package com.project2.ism.Service;

import com.project2.ism.Model.User;
import com.project2.ism.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepository;

    private final PasswordEncoder passwordEncoder;

    public UserService(){
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
}
