package com.fedguard.server.repository;

import com.fedguard.server.model.FLRound;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FLRoundRepository extends JpaRepository<FLRound, Long> {
    Optional<FLRound> findTopByOrderByRoundNumberDesc();
}