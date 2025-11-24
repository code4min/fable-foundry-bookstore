package com.bookstore.service;

import com.bookstore.dto.BookRequest;
import com.bookstore.model.Book;
import com.bookstore.model.Category;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import jakarta.transaction.Transactional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // ✅ Fetch all books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // ✅ Fetch by ID
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    // ✅ Add book using DTO
    public Book addBook(BookRequest bookRequest) {
        Book book = new Book();
        mapDtoToBook(bookRequest, book);
        return bookRepository.save(book);
    }

    // ✅ Update book using DTO
    public Book updateBook(Long id, BookRequest bookRequest) {
        Optional<Book> existingBookOpt = bookRepository.findById(id);
        if (existingBookOpt.isPresent()) {
            Book existingBook = existingBookOpt.get();
            mapDtoToBook(bookRequest, existingBook);
            return bookRepository.save(existingBook);
        }
        return null;
    }

    // ✅ Delete book
    public boolean deleteBook(Long id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    
    public Book checkAvailability(String title) {
        // Try exact match first
        Book book = bookRepository.findByTitleIgnoreCase(title);
        
        if (book != null) return book;

        // Fallback: partial match
        List<Book> fuzzyMatches = bookRepository.findByTitleContainingIgnoreCase(title);
        
        if (!fuzzyMatches.isEmpty()) {
            return fuzzyMatches.get(0); // Return the closest match
        }

        return null;
    }


    public List<Book> searchBooks(String query) {
        return bookRepository.searchByTitleOrAuthor(query.toLowerCase());
    }

    public List<Book> recommendByCategory(Long categoryId) {
        return bookRepository.findByCategory_Id(categoryId);
    }
    
    public List<Book> searchByTitleOrAuthor(String query) {
        return bookRepository.searchByTitleOrAuthor(query.toLowerCase());
    }



    // 🔹 Helper method for mapping
    private void mapDtoToBook(BookRequest dto, Book book) {
        book.setTitle(dto.getTitle());
        book.setAuthor(dto.getAuthor());
        book.setDescription(dto.getDescription());
        book.setPrice(dto.getPrice());
        book.setTrending(dto.isTrending());
        book.setImage(dto.getImage());
        
        if (dto.getStock() != null) {
            book.setStock(dto.getStock());
        }


        if (dto.getCategoryId() != null) {
            Optional<Category> categoryOpt = categoryRepository.findById(dto.getCategoryId());
            categoryOpt.ifPresent(book::setCategory);
        } else {
            book.setCategory(null);
        }
    }
    
    // ✅ Decrease stock after purchase
    @Transactional
    public boolean decrementStock(Long bookId, int quantity) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isEmpty()) return false;

        Book book = bookOpt.get();
        if (book.getStock() < quantity) {
            return false; // Not enough stock
        }

        book.setStock(book.getStock() - quantity);
        bookRepository.save(book);
        return true;
    }

    // ✅ Optional helper (for admin updates or validations)
    public void updateStock(Long bookId, int newStock) {
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if (bookOpt.isPresent()) {
            Book book = bookOpt.get();
            book.setStock(newStock);
            bookRepository.save(book);
        }
    }
}
