package com.fedguard.server.controller;

import com.fedguard.server.repository.AlertRepository;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {

    private final AlertRepository alertRepository;

    public StatsController(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        long totalAttacks = alertRepository.countByAttackTrue();
        long totalBenign  = alertRepository.countByAttackFalse();
        long totalAlerts  = totalAttacks + totalBenign;
        return Map.of(
            "totalAttacks", totalAttacks,
            "totalBenign",  totalBenign,
            "totalAlerts",  totalAlerts
        );
    }
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "FedGuard");
}
}