package com.bookstore.repository;

import com.bookstore.model.Wishlist;
import com.bookstore.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

    List<Wishlist> findByUserEmail(String email);

    Optional<Wishlist> findByUserEmailAndBookId(String email, Long bookId);

    boolean existsByUserEmailAndBookId(String email, Long bookId);

    void deleteByUserEmailAndBookId(String email, Long bookId);
    
}
