package com.aurora.inventory.config;

import com.aurora.inventory.domain.Category;
import com.aurora.inventory.domain.MovementType;
import com.aurora.inventory.domain.Product;
import com.aurora.inventory.repository.CategoryRepository;
import com.aurora.inventory.repository.ProductRepository;
import com.aurora.inventory.service.AlertService;
import com.aurora.inventory.service.StockService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            StockService stockService,
            AlertService alertService) {
        return args -> {
            if (categoryRepository.count() > 0) {
                return;
            }

            Category cafe = saveCategory(categoryRepository, "Café", "Granos, espresso y bebidas base café");
            Category matcha = saveCategory(categoryRepository, "Matcha", "Té matcha y ceremonias");
            Category dulces = saveCategory(categoryRepository, "Dulces", "Repostería y mochi de temporada");
            Category insumos = saveCategory(categoryRepository, "Insumos", "Leches, jarabes y consumibles");

            List<Product> products = List.of(
                    product("Sakura Latte", "CAF-001", cafe, "4500", "vaso", 42, 15),
                    product("Matcha Latte Aurora", "MAT-001", matcha, "4800", "vaso", 18, 12),
                    product("Pour Over de Origen", "CAF-002", cafe, "5200", "taza", 25, 10),
                    product("Mochi de Temporada", "DUL-001", dulces, "2800", "unidad", 8, 10),
                    product("Barras de Espresso", "CAF-003", cafe, "3500", "unidad", 60, 20),
                    product("Repostería del Día", "DUL-002", dulces, "3200", "unidad", 14, 8),
                    product("Leche de Almendras", "INS-001", insumos, "4500", "litro", 6, 8),
                    product("Jarabe de Sakura", "INS-002", insumos, "6900", "botella", 4, 5),
                    product("Ceremonial Matcha", "MAT-002", matcha, "18900", "lata", 3, 4),
                    product("Filtros V60", "INS-003", insumos, "2500", "pack", 22, 10));

            for (Product p : products) {
                Product saved = productRepository.save(p);
                if (saved.getStockQuantity() > 0) {
                    stockService.recordInitialStock(saved);
                }
                alertService.syncForProduct(saved);
            }

            Product mochi = productRepository.findBySkuIgnoreCase("DUL-001").orElseThrow();
            var out = new com.aurora.inventory.dto.StockMovementRequest();
            out.setProductId(mochi.getId());
            out.setType(MovementType.OUT);
            out.setQuantity(2);
            out.setReason("Venta mostrador");
            stockService.move(out);
        };
    }

    private Category saveCategory(CategoryRepository repo, String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        return repo.save(category);
    }

    private Product product(
            String name,
            String sku,
            Category category,
            String price,
            String unit,
            int stock,
            int minStock) {
        Product product = new Product();
        product.setName(name);
        product.setSku(sku);
        product.setCategory(category);
        product.setUnitPrice(new BigDecimal(price));
        product.setUnit(unit);
        product.setStockQuantity(stock);
        product.setMinStock(minStock);
        product.setActive(true);
        product.setDescription("Insumo / producto Aurora Coffee - " + name);
        return product;
    }
}
