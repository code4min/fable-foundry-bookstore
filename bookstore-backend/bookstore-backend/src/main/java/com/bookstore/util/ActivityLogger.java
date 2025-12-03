package com.bookstore.util;

import com.bookstore.model.User;
import com.bookstore.repository.UserRepository;
import com.bookstore.service.UserActivityService;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class ActivityLogger {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserActivityService userActivityService;

    
    public void log(Long userId, String action, String details) {
        userActivityService.logActivity(userId, action, details);
    }

    
    public void logByEmail(String email, String action, String details) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            userActivityService.logActivity(user.getId(), action, details);
        }
    }
}
