package com.fedguard.server.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "traffic_samples")
public class TrafficSample {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String clientId;
    @Column(columnDefinition = "TEXT")
    private String features;         // JSON array string
    private String predictedLabel;
    private LocalDateTime timestamp;
    private boolean usedInTraining;
}
