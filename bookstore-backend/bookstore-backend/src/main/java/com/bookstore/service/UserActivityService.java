package com.bookstore.service;

import com.bookstore.model.UserActivity;
import com.bookstore.repository.UserActivityRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserActivityService {

    @Autowired
    private UserActivityRepository userActivityRepository;

    // --- Create a log entry ---
    public void logActivity(Long userId, String action, String details) {
        UserActivity activity = new UserActivity();
        activity.setUserId(userId);
        activity.setAction(action);
        activity.setDetails(details);
        activity.setCreatedAt(LocalDateTime.now());
        userActivityRepository.save(activity);
    }

    // --- Fetch all logs for a user ---
    public List<UserActivity> getActivitiesByUserId(Long userId) {
        return userActivityRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // --- Fetch all logs (for admin dashboard global view) ---
    public List<UserActivity> getAllActivities() {
        return userActivityRepository.findAllByOrderByCreatedAtDesc();
    }
}
