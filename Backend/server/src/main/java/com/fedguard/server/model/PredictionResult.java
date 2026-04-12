package com.fedguard.server.model;

import lombok.Data;

@Data
public class PredictionResult {
    private String label;
    private double confidence;
    private boolean attack;
    private String clientId;
}
