package com.bookstore.controller;

import com.bookstore.model.User;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.UserService;
import com.bookstore.dto.UserLoginRequest;
import com.bookstore.util.JwtUtil;
import com.bookstore.util.ActivityLogger; // ✅ NEW

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.servlet.http.HttpServletRequest;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ActivityLogger activityLogger; // ✅ NEW


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            activityLogger.log(savedUser.getId(), savedUser.getEmail(), "User registered successfully"); // ✅
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Email already exists or invalid data");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginRequest request) {
        boolean isAuthenticated = userService.loginUser(request.getEmail(), request.getPassword());

        if (isAuthenticated) {
            User user = userService.getByEmail(request.getEmail());
            String role = user.getRole();
            String token = jwtUtil.generateToken(user.getEmail(), role);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("role", role);

            activityLogger.log(user.getId(), user.getEmail(), "User logged in"); // ✅

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(HttpServletRequest request) {
        String email = (String) request.getAttribute("userEmail");

        if (email == null) {
            return ResponseEntity.status(401).body("Unauthorized access: token missing or invalid");
        }

        return ResponseEntity.ok("You are authenticated as: " + email);
    }

    @GetMapping
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/updateContact")
    public ResponseEntity<String> updateContactInfo(@RequestBody User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findByEmail(updatedUser.getEmail());

        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            existingUser.setNumber(updatedUser.getNumber());
            existingUser.setAddress(updatedUser.getAddress());
            userRepository.save(existingUser);

            activityLogger.log(existingUser.getId(), existingUser.getEmail(), "Updated contact information"); // ✅
            return ResponseEntity.ok("Contact info updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }

    @PutMapping("/changePassword")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> passwordData) {
        String email = passwordData.get("email");
        String oldPassword = passwordData.get("oldPassword");
        String newPassword = passwordData.get("newPassword");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect current password.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        activityLogger.log(user.getId(), user.getEmail(), "Changed password"); // ✅
        return ResponseEntity.ok("Password updated successfully.");
    }

    @PutMapping("/deactivate")
    public ResponseEntity<String> deactivateAccount(@RequestParam String email) {
        userService.deactivateUser(email);
        Optional<User> userOpt = userRepository.findByEmail(email);
        userOpt.ifPresent(u -> activityLogger.log(u.getId(), u.getEmail(), "Account deactivated")); // ✅
        return ResponseEntity.ok("Account deactivated successfully");
    }
}
