package com.aurora.inventory.service;

import com.aurora.inventory.domain.AlertStatus;
import com.aurora.inventory.domain.Category;
import com.aurora.inventory.domain.Product;
import com.aurora.inventory.dto.CategoryStockReport;
import com.aurora.inventory.dto.ProductResponse;
import com.aurora.inventory.dto.ReportSummaryResponse;
import com.aurora.inventory.repository.CategoryRepository;
import com.aurora.inventory.repository.ProductRepository;
import com.aurora.inventory.repository.StockAlertRepository;
import com.aurora.inventory.repository.StockMovementRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ReportService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StockAlertRepository alertRepository;
    private final StockMovementRepository movementRepository;

    public ReportService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            StockAlertRepository alertRepository,
            StockMovementRepository movementRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.alertRepository = alertRepository;
        this.movementRepository = movementRepository;
    }

    public ReportSummaryResponse summary() {
        Instant weekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        List<Product> lowStock = productRepository.findLowStockProducts();
        BigDecimal value = productRepository.sumInventoryValue();
        if (value == null) {
            value = BigDecimal.ZERO;
        }

        ReportSummaryResponse report = new ReportSummaryResponse();
        report.setTotalProducts(productRepository.count());
        report.setActiveProducts(productRepository.countByActiveTrue());
        report.setTotalCategories(categoryRepository.count());
        report.setLowStockCount(lowStock.size());
        report.setOpenAlerts(alertRepository.countByStatus(AlertStatus.OPEN));
        report.setMovementsLast7Days(movementRepository.countByCreatedAtBetween(weekAgo, Instant.now()));
        report.setInventoryValue(value);
        report.setByCategory(buildCategoryReports());
        report.setTopLowStock(lowStock.stream().limit(8).map(ProductResponse::from).toList());
        return report;
    }

    private List<CategoryStockReport> buildCategoryReports() {
        List<CategoryStockReport> reports = new ArrayList<>();
        for (Category category : categoryRepository.findAll()) {
            List<Product> products = productRepository.findByCategoryId(category.getId());
            long units = products.stream().mapToLong(Product::getStockQuantity).sum();
            BigDecimal stockValue = products.stream()
                    .map(p -> p.getUnitPrice().multiply(BigDecimal.valueOf(p.getStockQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            reports.add(new CategoryStockReport(
                    category.getId(),
                    category.getName(),
                    products.size(),
                    units,
                    stockValue));
        }
        return reports;
    }
}
