package com.aurora.inventory.repository;

import com.aurora.inventory.domain.Product;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsBySkuIgnoreCase(String sku);
    boolean existsBySkuIgnoreCaseAndIdNot(String sku, Long id);
    Optional<Product> findBySkuIgnoreCase(String sku);
    List<Product> findByCategoryId(Long categoryId);
    long countByCategoryId(Long categoryId);

    @Query("SELECT p FROM Product p WHERE p.stockQuantity <= p.minStock AND p.active = true ORDER BY p.stockQuantity ASC")
    List<Product> findLowStockProducts();

    @Query("SELECT COALESCE(SUM(p.stockQuantity * p.unitPrice), 0) FROM Product p WHERE p.active = true")
    java.math.BigDecimal sumInventoryValue();

    long countByActiveTrue();
}
