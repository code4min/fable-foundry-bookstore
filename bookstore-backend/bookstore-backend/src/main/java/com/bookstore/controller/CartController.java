package com.bookstore.controller;

import com.bookstore.dto.CartRequest;
import com.bookstore.model.Book;
import com.bookstore.model.Cart;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CartRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestBody CartRequest request) {
        String email = request.getEmail();
        Long bookId = request.getBookId();

        if (cartRepository.existsByUserEmailAndBookId(email, bookId)) {
            return ResponseEntity.ok("Book already in cart");
        }

        Book book = bookRepository.findById(bookId).orElse(null);
        if (book == null) {
            return ResponseEntity.badRequest().body("Book not found");
        }

        Cart cartItem = new Cart(email, book);
        cartRepository.save(cartItem);
        return ResponseEntity.ok("Book added to cart");
    }

    @Transactional
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromCart(@RequestBody CartRequest request) {
        String email = request.getEmail();
        Long bookId = request.getBookId();

        if (!cartRepository.existsByUserEmailAndBookId(email, bookId)) {
            return ResponseEntity.ok("Book not found in cart");
        }

        cartRepository.deleteByUserEmailAndBookId(email, bookId);
        return ResponseEntity.ok("Book removed from cart");
    }

    @GetMapping
    public ResponseEntity<List<Book>> getCartBooks(@RequestParam String email) {
        List<Cart> cartItems = cartRepository.findByUserEmail(email);
        List<Book> books = cartItems.stream()
                .map(Cart::getBook)
                .toList();
        return ResponseEntity.ok(books);
    }
}
