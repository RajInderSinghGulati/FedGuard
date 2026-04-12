package com.fedguard.server.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private static final String SECRET = "FedGuardSecretKey2026FedGuardSecretKey2026!!"; // min 32 chars
    private static final long EXPIRY_MS = 1000L * 60 * 60 * 24; // 24 hours

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String clientId) {
        return Jwts.builder()
                .subject(clientId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRY_MS))
                .signWith(key)
                .compact();
    }

    public String extractClientId(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isValid(String token) {
        try {
            extractClientId(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
}