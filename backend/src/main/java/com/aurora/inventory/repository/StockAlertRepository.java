package com.aurora.inventory.repository;

import com.aurora.inventory.domain.AlertStatus;
import com.aurora.inventory.domain.StockAlert;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockAlertRepository extends JpaRepository<StockAlert, Long> {
    List<StockAlert> findByStatusOrderByCreatedAtDesc(AlertStatus status);
    List<StockAlert> findAllByOrderByCreatedAtDesc();
    Optional<StockAlert> findFirstByProductIdAndStatus(Long productId, AlertStatus status);
    long countByStatus(AlertStatus status);
    void deleteByProductId(Long productId);
}
