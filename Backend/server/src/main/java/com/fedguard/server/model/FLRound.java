package com.fedguard.server.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fl_rounds")
public class FLRound {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int roundNumber;
    private int participantCount;
    private double globalAccuracy;
    private double globalLoss;
    private LocalDateTime completedAt;

    @Column(columnDefinition = "TEXT")
    private String globalWeights; // JSON string of averaged weights

    // Getters + Setters
    public Long getId() { return id; }
    public int getRoundNumber() { return roundNumber; }
    public void setRoundNumber(int r) { roundNumber = r; }
    public int getParticipantCount() { return participantCount; }
    public void setParticipantCount(int p) { participantCount = p; }
    public double getGlobalAccuracy() { return globalAccuracy; }
    public void setGlobalAccuracy(double a) { globalAccuracy = a; }
    public double getGlobalLoss() { return globalLoss; }
    public void setGlobalLoss(double l) { globalLoss = l; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime t) { completedAt = t; }
    public String getGlobalWeights() { return globalWeights; }
    public void setGlobalWeights(String w) { globalWeights = w; }
}