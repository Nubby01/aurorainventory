package com.aurora.inventory.service;

import com.aurora.inventory.domain.AlertStatus;
import com.aurora.inventory.domain.Product;
import com.aurora.inventory.domain.StockAlert;
import com.aurora.inventory.dto.AlertResponse;
import com.aurora.inventory.exception.ResourceNotFoundException;
import com.aurora.inventory.repository.StockAlertRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AlertService {

    private final StockAlertRepository alertRepository;

    public AlertService(StockAlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> findAll() {
        return alertRepository.findAllByOrderByCreatedAtDesc().stream().map(AlertResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> findOpen() {
        return alertRepository.findByStatusOrderByCreatedAtDesc(AlertStatus.OPEN).stream()
                .map(AlertResponse::from)
                .toList();
    }

    public AlertResponse resolve(Long id) {
        StockAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta no encontrada: " + id));
        alert.setStatus(AlertStatus.RESOLVED);
        alert.setResolvedAt(Instant.now());
        return AlertResponse.from(alert);
    }

    public void syncForProduct(Product product) {
        if (product.isLowStock() && product.isActive()) {
            openIfNeeded(product);
        } else {
            resolveOpenForProduct(product.getId());
        }
    }

    private void openIfNeeded(Product product) {
        alertRepository.findFirstByProductIdAndStatus(product.getId(), AlertStatus.OPEN)
                .ifPresentOrElse(
                        existing -> {
                            existing.setStockAtAlert(product.getStockQuantity());
                            existing.setMinStockAtAlert(product.getMinStock());
                            existing.setMessage(buildMessage(product));
                        },
                        () -> {
                            StockAlert alert = new StockAlert();
                            alert.setProduct(product);
                            alert.setStatus(AlertStatus.OPEN);
                            alert.setStockAtAlert(product.getStockQuantity());
                            alert.setMinStockAtAlert(product.getMinStock());
                            alert.setMessage(buildMessage(product));
                            alertRepository.save(alert);
                        });
    }

    private void resolveOpenForProduct(Long productId) {
        alertRepository.findFirstByProductIdAndStatus(productId, AlertStatus.OPEN).ifPresent(alert -> {
            alert.setStatus(AlertStatus.RESOLVED);
            alert.setResolvedAt(Instant.now());
        });
    }

    private String buildMessage(Product product) {
        return "Stock bajo: " + product.getName() + " tiene " + product.getStockQuantity()
                + " " + product.getUnit() + " (mínimo " + product.getMinStock() + ")";
    }
}
