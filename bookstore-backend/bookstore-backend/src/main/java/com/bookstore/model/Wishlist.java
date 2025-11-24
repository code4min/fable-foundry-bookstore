package com.bookstore.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wishlist")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    // Constructors
    public Wishlist() {}

    public Wishlist(String userEmail, Book book) {
        this.userEmail = userEmail;
        this.book = book;
    }

    // Getters and setters
    public Long getId() { return id; }

    public String getUserEmail() { return userEmail; }

    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public Book getBook() { return book; }

    public void setBook(Book book) { this.book = book; }
}

