package com.fedguard.server.controller;

import com.fedguard.server.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final JwtUtil jwtUtil;

    // Whitelisted client IDs — replace with DB lookup in production
    private static final Set<String> ALLOWED_CLIENTS = Set.of(
        "client-1", "client-2", "client-3"
    );

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/token")
    public ResponseEntity<?> getToken(@RequestBody Map<String, String> body) {
        String clientId = body.get("clientId");
        String secret   = body.get("secret");

        // Simple shared secret check — replace with DB in production
        if (!ALLOWED_CLIENTS.contains(clientId) || !"fedguard2026".equals(secret)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        return ResponseEntity.ok(Map.of(
            "token", jwtUtil.generateToken(clientId),
            "clientId", clientId
        ));
    }
}