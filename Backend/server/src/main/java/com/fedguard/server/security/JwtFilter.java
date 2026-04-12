package com.fedguard.server.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {

        String path = req.getRequestURI();

        // Only protect FL submit endpoint
        if (path.equals("/api/fl/submit")) {
            String header = req.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                res.setStatus(401);
                res.getWriter().write("{\"error\":\"Missing token\"}");
                return;
            }
            String token = header.substring(7);
            if (!jwtUtil.isValid(token)) {
                res.setStatus(401);
                res.getWriter().write("{\"error\":\"Invalid token\"}");
                return;
            }
        }
        chain.doFilter(req, res);
    }
}