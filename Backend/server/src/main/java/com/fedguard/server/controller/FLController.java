package com.fedguard.server.controller;

import com.fedguard.server.model.ClientUpdate;
import com.fedguard.server.model.FLRound;
import com.fedguard.server.service.FLService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fl")
@CrossOrigin(origins = "*")
public class FLController {

    private final FLService flService;

    public FLController(FLService flService) {
        this.flService = flService;
    }

    // Python clients POST their weights here after local training
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitUpdate(@RequestBody ClientUpdate update) {
        String status = flService.submitUpdate(update);
        return ResponseEntity.ok(Map.of(
            "status", status,
            "currentRound", flService.getCurrentRound()
        ));
    }

    // Python clients GET global model before local training
    @GetMapping("/global-model")
    public ResponseEntity<Map<String, Object>> getGlobalModel() {
        return ResponseEntity.ok(Map.of(
            "round", flService.getCurrentRound(),
            "weights", flService.getGlobalWeights()
        ));
    }

    // Dashboard fetches round history for chart
    @GetMapping("/rounds")
    public ResponseEntity<List<FLRound>> getRounds() {
        return ResponseEntity.ok(flService.getRoundHistory());
    }

    // Current round number + latest accuracy
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        List<FLRound> history = flService.getRoundHistory();
        double latestAccuracy = history.isEmpty() ? 0.0 :
            history.get(history.size() - 1).getGlobalAccuracy();
        return ResponseEntity.ok(Map.of(
            "currentRound", flService.getCurrentRound(),
            "totalRounds", history.size(),
            "latestAccuracy", latestAccuracy
        ));
    }
}