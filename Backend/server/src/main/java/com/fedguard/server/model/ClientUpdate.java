package com.fedguard.server.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "client_updates")
public class ClientUpdate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String clientId;
    private int roundNumber;
    private double accuracy;
    private double loss;

    @Column(columnDefinition = "TEXT")
    private String weights; // JSON array of floats

    private LocalDateTime submittedAt;

    // Getters + Setters
    public Long getId() { return id; }
    public String getClientId() { return clientId; }
    public void setClientId(String c) { clientId = c; }
    public int getRoundNumber() { return roundNumber; }
    public void setRoundNumber(int r) { roundNumber = r; }
    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double a) { accuracy = a; }
    public double getLoss() { return loss; }
    public void setLoss(double l) { loss = l; }
    public String getWeights() { return weights; }
    public void setWeights(String w) { weights = w; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime t) { submittedAt = t; }
}