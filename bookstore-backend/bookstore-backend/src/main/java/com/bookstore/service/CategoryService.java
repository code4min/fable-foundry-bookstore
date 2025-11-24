package com.bookstore.service;

import com.bookstore.model.Category;
import com.bookstore.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // ✅ Get all categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // ✅ Get category by ID
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    // ✅ Add new category (prevent duplicates)
    public Category addCategory(Category category) {
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new RuntimeException("Category already exists!");
        }
        return categoryRepository.save(category);
    }

    // ✅ Update existing category
    public Category updateCategory(Long id, Category updatedCategory) {
        Optional<Category> existingOpt = categoryRepository.findById(id);

        if (existingOpt.isPresent()) {
            Category existing = existingOpt.get();
            existing.setName(updatedCategory.getName());
            return categoryRepository.save(existing);
        }
        return null;
    }

    // ✅ Delete category by ID
    public boolean deleteCategory(Long id) {
        if (categoryRepository.existsById(id)) {
            categoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
