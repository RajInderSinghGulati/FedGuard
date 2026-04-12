package com.fedguard.server.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "clients")
public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String clientId;         // e.g. "bank-of-india"
    private String name;
    private String apiKey;           // UUID token
    private String status;           // ONLINE / OFFLINE
    private LocalDateTime lastSeen;
    private LocalDateTime lastSubmission;
    private double localAccuracy;
    private int roundsParticipated;
}
