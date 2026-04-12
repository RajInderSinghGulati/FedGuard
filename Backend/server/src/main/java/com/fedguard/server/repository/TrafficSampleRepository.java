package com.fedguard.server.repository;

import com.fedguard.server.model.TrafficSample;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrafficSampleRepository extends JpaRepository<TrafficSample, Long> {
    List<TrafficSample> findByUsedInTrainingFalse();
}
