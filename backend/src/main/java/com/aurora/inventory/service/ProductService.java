package com.aurora.inventory.service;

import com.aurora.inventory.domain.Category;
import com.aurora.inventory.domain.Product;
import com.aurora.inventory.dto.ProductRequest;
import com.aurora.inventory.dto.ProductResponse;
import com.aurora.inventory.exception.BusinessException;
import com.aurora.inventory.exception.ResourceNotFoundException;
import com.aurora.inventory.repository.ProductRepository;
import com.aurora.inventory.repository.StockAlertRepository;
import com.aurora.inventory.repository.StockMovementRepository;
import java.util.List;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final AlertService alertService;
    private final StockService stockService;
    private final StockMovementRepository movementRepository;
    private final StockAlertRepository alertRepository;

    public ProductService(
            ProductRepository productRepository,
            CategoryService categoryService,
            AlertService alertService,
            @Lazy StockService stockService,
            StockMovementRepository movementRepository,
            StockAlertRepository alertRepository) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
        this.alertService = alertService;
        this.stockService = stockService;
        this.movementRepository = movementRepository;
        this.alertRepository = alertRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        return productRepository.findAll().stream().map(ProductResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return ProductResponse.from(getEntity(id));
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findLowStock() {
        return productRepository.findLowStockProducts().stream().map(ProductResponse::from).toList();
    }

    public ProductResponse create(ProductRequest request) {
        if (productRepository.existsBySkuIgnoreCase(request.getSku().trim())) {
            throw new BusinessException("Ya existe un producto con ese SKU");
        }
        Category category = categoryService.getEntity(request.getCategoryId());
        Product product = new Product();
        apply(product, request, category);
        Product saved = productRepository.save(product);
        if (saved.getStockQuantity() > 0) {
            stockService.recordInitialStock(saved);
        }
        alertService.syncForProduct(saved);
        return ProductResponse.from(saved);
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getEntity(id);
        if (productRepository.existsBySkuIgnoreCaseAndIdNot(request.getSku().trim(), id)) {
            throw new BusinessException("Ya existe un producto con ese SKU");
        }
        Category category = categoryService.getEntity(request.getCategoryId());
        int previousStock = product.getStockQuantity();
        apply(product, request, category);
        if (previousStock != request.getStockQuantity()) {
            stockService.recordAdjustment(
                    product,
                    previousStock,
                    request.getStockQuantity(),
                    "Ajuste desde edición de producto");
        }
        alertService.syncForProduct(product);
        return ProductResponse.from(product);
    }

    public void delete(Long id) {
        Product product = getEntity(id);
        movementRepository.deleteByProductId(id);
        alertRepository.deleteByProductId(id);
        productRepository.delete(product);
    }

    public Product getEntity(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
    }

    private void apply(Product product, ProductRequest request, Category category) {
        product.setName(request.getName().trim());
        product.setSku(request.getSku().trim().toUpperCase());
        product.setDescription(trimToNull(request.getDescription()));
        product.setCategory(category);
        product.setUnitPrice(request.getUnitPrice());
        product.setUnit(request.getUnit() == null || request.getUnit().isBlank() ? "unidad" : request.getUnit().trim());
        product.setStockQuantity(request.getStockQuantity());
        product.setMinStock(request.getMinStock());
        product.setActive(request.getActive() == null || request.getActive());
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
