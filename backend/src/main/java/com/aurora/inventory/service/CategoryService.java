package com.aurora.inventory.service;

import com.aurora.inventory.domain.Category;
import com.aurora.inventory.dto.CategoryRequest;
import com.aurora.inventory.dto.CategoryResponse;
import com.aurora.inventory.exception.BusinessException;
import com.aurora.inventory.exception.ResourceNotFoundException;
import com.aurora.inventory.repository.CategoryRepository;
import com.aurora.inventory.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(c -> CategoryResponse.from(c, productRepository.countByCategoryId(c.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) {
        Category category = getEntity(id);
        return CategoryResponse.from(category, productRepository.countByCategoryId(id));
    }

    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new BusinessException("Ya existe una categoría con ese nombre");
        }
        Category category = new Category();
        category.setName(request.getName().trim());
        category.setDescription(trimToNull(request.getDescription()));
        Category saved = categoryRepository.save(category);
        return CategoryResponse.from(saved, 0);
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = getEntity(id);
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(request.getName().trim(), id)) {
            throw new BusinessException("Ya existe una categoría con ese nombre");
        }
        category.setName(request.getName().trim());
        category.setDescription(trimToNull(request.getDescription()));
        return CategoryResponse.from(category, productRepository.countByCategoryId(id));
    }

    public void delete(Long id) {
        Category category = getEntity(id);
        if (productRepository.countByCategoryId(id) > 0) {
            throw new BusinessException("No se puede eliminar una categoría con productos asociados");
        }
        categoryRepository.delete(category);
    }

    public Category getEntity(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada: " + id));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
