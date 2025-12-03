package com.bookstore.repository;

import com.bookstore.model.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

    
    List<UserActivity> findByUserIdOrderByCreatedAtDesc(Long userId);

    
    List<UserActivity> findByUserIdAndActionContainingIgnoreCaseOrderByCreatedAtDesc(Long userId, String actionFragment);

    
    List<UserActivity> findAllByOrderByCreatedAtDesc();
}
