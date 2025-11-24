package com.bookstore.controller;

import com.bookstore.model.UserActivity;
import com.bookstore.service.UserActivityService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/admin/activities")
@CrossOrigin(origins = "*")
public class UserActivityController {

    @Autowired
    private UserActivityService userActivityService;

    // ✅ Get all logs (global)
    @GetMapping("/all")
    public ResponseEntity<List<UserActivity>> getAllActivities() {
        return ResponseEntity.ok(userActivityService.getAllActivities());
    }

    // ✅ Get logs for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserActivity>> getUserActivities(@PathVariable Long userId) {
        return ResponseEntity.ok(userActivityService.getActivitiesByUserId(userId));
    }
}
