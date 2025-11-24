package com.bookstore.repository;

import com.bookstore.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUserEmail(String email);

    Optional<Cart> findByUserEmailAndBookId(String email, Long bookId);

    boolean existsByUserEmailAndBookId(String email, Long bookId);

    void deleteByUserEmailAndBookId(String email, Long bookId);
    
}
