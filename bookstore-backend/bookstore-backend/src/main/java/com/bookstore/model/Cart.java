package com.bookstore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    // Constructors
    public Cart() {}

    public Cart(String userEmail, Book book) {
        this.userEmail = userEmail;
        this.book = book;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public String getUserEmail() { return userEmail; }

    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Book getBook() { return book; }

    public void setBook(Book book) { this.book = book; }
}
