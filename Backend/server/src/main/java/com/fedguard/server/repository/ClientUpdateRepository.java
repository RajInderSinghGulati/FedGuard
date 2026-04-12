package com.fedguard.server.repository;

import com.fedguard.server.model.ClientUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClientUpdateRepository extends JpaRepository<ClientUpdate, Long> {
    List<ClientUpdate> findByRoundNumber(int roundNumber);
    boolean existsByClientIdAndRoundNumber(String clientId, int roundNumber);
}