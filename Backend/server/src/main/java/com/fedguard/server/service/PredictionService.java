package com.fedguard.server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fedguard.server.model.*;
import com.fedguard.server.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    @Autowired private RestTemplate restTemplate;
    @Autowired private AlertRepository alertRepository;
    @Autowired private TrafficSampleRepository sampleRepository;
    @Autowired private ObjectMapper objectMapper;

    @Value("${python.api.url}")
    private String pythonUrl;

    public PredictionResult predict(TrafficRequest req) throws Exception {
        // Pad features to 78
        List<Double> features = req.getFeatures();
        while (features.size() < 78) features.add(0.0);

        // Call Flask
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(
            Map.of("features", features), headers
        );

        PredictionResult result = restTemplate.postForEntity(
            pythonUrl + "/predict", request, PredictionResult.class
        ).getBody();

        result.setClientId(req.getClientId());

        // Save alert
        Alert alert = new Alert();
        alert.setClientId(req.getClientId());
        alert.setLabel(result.getLabel());
        alert.setConfidence(result.getConfidence());
        alert.setAttack(result.isAttack());
        alert.setTimestamp(LocalDateTime.now());
        alertRepository.save(alert);

        // Save to fine-tuning DB
        TrafficSample sample = new TrafficSample();
        sample.setClientId(req.getClientId());
        sample.setFeatures(objectMapper.writeValueAsString(features));
        sample.setPredictedLabel(result.getLabel());
        sample.setTimestamp(LocalDateTime.now());
        sample.setUsedInTraining(false);
        sampleRepository.save(sample);

        return result;
    }
}
