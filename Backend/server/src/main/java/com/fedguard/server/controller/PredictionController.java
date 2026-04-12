package com.fedguard.server.controller;

import com.fedguard.server.model.*;
import com.fedguard.server.repository.AlertRepository;
import com.fedguard.server.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PredictionController {

    @Autowired private PredictionService predictionService;
    @Autowired private AlertRepository alertRepository;

    @PostMapping("/predict")
    public ResponseEntity<PredictionResult> predict(@RequestBody TrafficRequest req) throws Exception {
        return ResponseEntity.ok(predictionService.predict(req));
    }

    @GetMapping("/alerts")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<List<Alert>> getAlerts() {
        return ResponseEntity.ok(alertRepository.findTop10ByOrderByTimestampDesc());
    }

    @GetMapping("/alerts/{clientId}")
    public ResponseEntity<List<Alert>> getClientAlerts(@PathVariable String clientId) {
        return ResponseEntity.ok(alertRepository.findByClientIdOrderByTimestampDesc(clientId));
    }
}
