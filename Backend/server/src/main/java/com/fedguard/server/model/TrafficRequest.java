package com.fedguard.server.model;

import lombok.Data;
import java.util.List;

@Data
public class TrafficRequest {
    private String clientId;
    private List<Double> features;
}
