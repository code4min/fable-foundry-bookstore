package com.bookstore.dto;

public class BookRequest {
    private String title;
    private String author;
    private Long categoryId; 
    private String image;
    private String description;
    private boolean trending;
    private double price;
    private Integer stock;

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isTrending() { return trending; }
    public void setTrending(boolean trending) { this.trending = trending; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    
    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

}
