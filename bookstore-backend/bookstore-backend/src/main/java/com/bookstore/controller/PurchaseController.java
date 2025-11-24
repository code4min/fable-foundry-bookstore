package com.bookstore.controller;

import com.bookstore.model.Cart;
import com.bookstore.model.Purchase;
import com.bookstore.model.Book;
import com.bookstore.repository.CartRepository;
import com.bookstore.repository.PurchaseRepository;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.UserRepository; // ✅ NEW
import com.bookstore.model.User;
import com.bookstore.util.ActivityLogger; // ✅ NEW

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/purchase")
@CrossOrigin(origins = "*")
public class PurchaseController {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository; // ✅ NEW

    @Autowired
    private ActivityLogger activityLogger; // ✅ NEW

    private LocalDate computeEstimatedDeliveryDate() {
        return LocalDate.now().plusDays(new Random().nextInt(8) + 3);
    }

    @GetMapping("/estimateDelivery")
    public LocalDate estimateDelivery() {
        return computeEstimatedDeliveryDate();
    }

    @PostMapping("/buyAll")
    public String purchaseAll(@RequestParam String email,
                              @RequestParam String deliveryAddress,
                              @RequestParam(required = false) LocalDate deliveryDate) {

        List<Cart> cartItems = cartRepository.findByUserEmail(email);
        if (cartItems.isEmpty()) {
            return "Cart is empty. Nothing to purchase.";
        }

        for (Cart item : cartItems) {
            Book book = item.getBook();
            if (book.getStock() <= 0) {
                return "Book '" + book.getTitle() + "' is out of stock.";
            }
        }

        LocalDate finalDeliveryDate = (deliveryDate != null) ? deliveryDate : computeEstimatedDeliveryDate();

        for (Cart item : cartItems) {
            Book book = item.getBook();

            int newStock = book.getStock() - 1;
            book.setStock(Math.max(newStock, 0));
            bookRepository.save(book);

            Purchase purchase = new Purchase();
            purchase.setEmail(email);
            purchase.setBookId(book.getId());
            purchase.setTitle(book.getTitle());
            purchase.setAuthor(book.getAuthor());
            purchase.setPrice(book.getPrice());
            purchase.setImage(book.getImage());
            purchase.setPurchaseDate(LocalDate.now());
            purchase.setDeliveryDate(finalDeliveryDate);
            purchase.setStatus("Processing");
            purchase.setDeliveryAddress(deliveryAddress);

            purchaseRepository.save(purchase);
        }

        cartRepository.deleteAll(cartItems);

        // ✅ Log user activity
        Optional<User> userOpt = userRepository.findByEmail(email);
        userOpt.ifPresent(u -> activityLogger.log(u.getId(), email, "Completed a purchase of " + cartItems.size() + " items"));

        return "Purchase successful!";
    }

    @GetMapping
    public List<Purchase> getPurchasesByEmail(@RequestParam String email) {
        return purchaseRepository.findByEmail(email);
    }

    @GetMapping("/admin/all")
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @RequestBody Purchase updatedPurchase) {
        Optional<Purchase> optionalPurchase = purchaseRepository.findById(id);
        if (optionalPurchase.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Purchase existingPurchase = optionalPurchase.get();
        String oldStatus = existingPurchase.getStatus();
        String newStatus = updatedPurchase.getStatus();

        if ("Delivered".equalsIgnoreCase(oldStatus) && "Cancelled".equalsIgnoreCase(newStatus)) {
            return ResponseEntity.badRequest().body("Delivered orders cannot be cancelled.");
        }

        if (newStatus != null && !newStatus.equals(oldStatus)) {
            existingPurchase.setStatus(newStatus);
            if ("Cancelled".equalsIgnoreCase(newStatus) && !"Cancelled".equalsIgnoreCase(oldStatus)) {
                Long bookId = existingPurchase.getBookId();
                bookRepository.findById(bookId).ifPresent(book -> {
                    book.setStock(book.getStock() + 1);
                    bookRepository.save(book);
                });
            }
        }

        if (updatedPurchase.getDeliveryDate() != null) {
            existingPurchase.setDeliveryDate(updatedPurchase.getDeliveryDate());
        }

        purchaseRepository.save(existingPurchase);
        return ResponseEntity.ok(existingPurchase);
    }

    @GetMapping("/admin/search")
    public List<Purchase> searchOrdersByEmail(@RequestParam String email) {
        return purchaseRepository.findByEmailContainingIgnoreCase(email);
    }

    @GetMapping("/admin/status")
    public List<Purchase> getOrdersByStatus(@RequestParam String status) {
        return purchaseRepository.findByStatus(status);
    }

    @GetMapping("/admin/filter")
    public List<Purchase> filterOrders(@RequestParam(required = false) String email,
                                       @RequestParam(required = false) String status) {
        List<Purchase> allOrders = purchaseRepository.findAll();
        return allOrders.stream()
                .filter(p -> (email == null || p.getEmail().toLowerCase().contains(email.toLowerCase())))
                .filter(p -> (status == null || p.getStatus().equalsIgnoreCase(status)))
                .toList();
    }
}
