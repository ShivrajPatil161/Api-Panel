package com.project2.ism.Controller;

import com.project2.ism.Model.User;
import com.project2.ism.Service.JwtService;
import com.project2.ism.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
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
            String token = jwtService.generateToken(loggedInUser.getEmail(), loggedInUser.getRole());

            return ResponseEntity.ok(Map.of(
                    "email", loggedInUser.getEmail(),
                    "role", loggedInUser.getRole(),
                    "token", token,
                    "message", "Login successful"
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid Credentials"));
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

}
