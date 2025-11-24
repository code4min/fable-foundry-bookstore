package com.bookstore.repository;

import com.bookstore.model.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

    // fetch recent activities for a user, newest first
    List<UserActivity> findByUserIdOrderByCreatedAtDesc(Long userId);

    // simple search by action or details (case-insensitive) — optional helper
    List<UserActivity> findByUserIdAndActionContainingIgnoreCaseOrderByCreatedAtDesc(Long userId, String actionFragment);

    // fetch all recent activities globally (admin might use this)
    List<UserActivity> findAllByOrderByCreatedAtDesc();
}
