package com.bookstore.controller;

import com.bookstore.model.User;
import com.bookstore.service.UserService;
import com.bookstore.util.ActivityLogger; 
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.*;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ActivityLogger activityLogger; 

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }

    @GetMapping("/status")
    public ResponseEntity<List<User>> filterByStatus(@RequestParam String status) {
        boolean isActive = status.equalsIgnoreCase("active");
        return ResponseEntity.ok(userService.filterByStatus(isActive));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<String> toggleUserStatus(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            boolean newStatus = !user.isActive();
            userService.toggleUserStatus(id);

            String action = newStatus ? "Admin reactivated user" : "Admin deactivated user";
            activityLogger.log(id, user.getEmail(), action); 

            return ResponseEntity.ok("User status updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    
    @GetMapping("/{id}/logs")
    public ResponseEntity<?> getUserLogs(@PathVariable Long id) {
        Map<String, Object> logs = new HashMap<>();
        logs.put("userId", id);
        logs.put("actions", List.of(
            Map.of("timestamp", "2025-10-30 15:23", "action", "Logged in"),
            Map.of("timestamp", "2025-10-30 15:25", "action", "Placed an order"),
            Map.of("timestamp", "2025-10-30 15:30", "action", "Order delivered")
        ));
        return ResponseEntity.ok(logs);
    }
}
