package com.fedguard.server.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fedguard.server.model.ClientUpdate;
import com.fedguard.server.model.FLRound;
import com.fedguard.server.repository.ClientUpdateRepository;
import com.fedguard.server.repository.FLRoundRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FLService {

    private final ClientUpdateRepository updateRepo;
    private final FLRoundRepository roundRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    private static final int MIN_CLIENTS = 2; // minimum before aggregation triggers

    public FLService(ClientUpdateRepository updateRepo, FLRoundRepository roundRepo) {
        this.updateRepo = updateRepo;
        this.roundRepo  = roundRepo;
    }

    public int getCurrentRound() {
        return roundRepo.findTopByOrderByRoundNumberDesc()
                .map(r -> r.getRoundNumber())
                .orElse(0);
    }

    public String getGlobalWeights() {
        return roundRepo.findTopByOrderByRoundNumberDesc()
                .map(FLRound::getGlobalWeights)
                .orElse("[]");
    }

    public synchronized String submitUpdate(ClientUpdate update) {
        int round = getCurrentRound() + 1;

        // Prevent duplicate submissions per client per round
        if (updateRepo.existsByClientIdAndRoundNumber(update.getClientId(), round)) {
            return "DUPLICATE";
        }

        update.setRoundNumber(round);
        update.setSubmittedAt(LocalDateTime.now());
        updateRepo.save(update);

        List<ClientUpdate> updates = updateRepo.findByRoundNumber(round);
        if (updates.size() >= MIN_CLIENTS) {
            aggregate(round, updates);
            return "AGGREGATED";
        }
        return "WAITING";
    }

    private void aggregate(int round, List<ClientUpdate> updates) {
        try {
            // Parse all weight arrays
            List<List<Double>> allWeights = updates.stream()
                .map(u -> {
                    try {
                        return mapper.readValue(u.getWeights(),
                            new TypeReference<List<Double>>() {});
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                }).toList();

            int size = allWeights.get(0).size();
            double[] avg = new double[size];

            // FedAvg — simple mean of all client weights
            for (List<Double> w : allWeights) {
                for (int i = 0; i < size; i++) {
                    avg[i] += w.get(i) / allWeights.size();
                }
            }

            // Average accuracy + loss across clients
            double avgAccuracy = updates.stream()
                .mapToDouble(ClientUpdate::getAccuracy).average().orElse(0);
            double avgLoss = updates.stream()
                .mapToDouble(ClientUpdate::getLoss).average().orElse(0);

            FLRound flRound = new FLRound();
            flRound.setRoundNumber(round);
            flRound.setParticipantCount(updates.size());
            flRound.setGlobalAccuracy(avgAccuracy);
            flRound.setGlobalLoss(avgLoss);
            flRound.setCompletedAt(LocalDateTime.now());
            flRound.setGlobalWeights(mapper.writeValueAsString(avg));
            roundRepo.save(flRound);

        } catch (Exception e) {
            throw new RuntimeException("FedAvg aggregation failed: " + e.getMessage());
        }
    }

    public List<FLRound> getRoundHistory() {
        return roundRepo.findAll();
    }
}