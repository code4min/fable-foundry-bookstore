package com.bookstore.repository;

import com.bookstore.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface BookRepository extends JpaRepository<Book, Long> {
	List<Book> findByStockLessThanOrderByStockAsc(int threshold);
	
	Book findByTitleIgnoreCase(String title);

	List<Book> findByAuthorContainingIgnoreCase(String author);

	List<Book> findByTitleContainingIgnoreCase(String title);

	List<Book> findByCategory_Id(Long categoryId);
	
	@Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE %:query% OR LOWER(b.author) LIKE %:query%")
	List<Book> searchByTitleOrAuthor(@Param("query") String query);


}

