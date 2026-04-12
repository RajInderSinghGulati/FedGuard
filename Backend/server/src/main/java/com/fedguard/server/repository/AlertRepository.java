package com.fedguard.server.repository;

import com.fedguard.server.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findTop10ByOrderByTimestampDesc();
    List<Alert> findByClientIdOrderByTimestampDesc(String clientId);
    long countByAttackTrue();
    long countByAttackFalse();
}
