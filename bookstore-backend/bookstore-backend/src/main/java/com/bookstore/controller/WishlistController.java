package com.bookstore.controller;

import com.bookstore.model.Book;
import com.bookstore.model.Wishlist;
import com.bookstore.model.WishlistRequest;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addToWishlist(@RequestBody WishlistRequest request) {
        String email = request.getEmail();
        Long bookId = request.getBookId();

        if (wishlistRepository.existsByUserEmailAndBookId(email, bookId)) {
            return ResponseEntity.ok("Book already in wishlist");
        }

        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Book not found");
        }

        Wishlist wishlistItem = new Wishlist(email, bookOpt.get());
        wishlistRepository.save(wishlistItem);

        return ResponseEntity.ok("Book added to wishlist");
    }

    
    @Transactional
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromWishlist(@RequestBody WishlistRequest request) {
        String email = request.getEmail();
        Long bookId = request.getBookId();

        if (!wishlistRepository.existsByUserEmailAndBookId(email, bookId)) {
            return ResponseEntity.ok("Book not found in wishlist");
        }

        wishlistRepository.deleteByUserEmailAndBookId(email, bookId);
        return ResponseEntity.ok("Book removed from wishlist");
    }


    @GetMapping("/check")
    public ResponseEntity<Boolean> isBookInWishlist(@RequestParam String email, @RequestParam Long bookId) {
        boolean exists = wishlistRepository.existsByUserEmailAndBookId(email, bookId);
        return ResponseEntity.ok(exists);
    }
    
    @GetMapping
    public ResponseEntity<List<Book>> getWishlistBooks(@RequestParam String email) {
        List<Wishlist> wishlistItems = wishlistRepository.findByUserEmail(email);
        List<Book> books = wishlistItems.stream()
                                        .map(Wishlist::getBook)
                                        .toList();
        return ResponseEntity.ok(books);
    }

}
