package com.example.random_steam_game_recommender.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "c2VjcmV0S2V5Rm9yU29tZVNhbXBsZQ=="; // Use a strong secret key
    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    public String generateToken(String username, String userId) {
        // Create claims map
        Claims claims = Jwts.claims();
        claims.put("username", username);
        claims.put("userId", userId);

        // Build the token
        JwtBuilder builder = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY);

        return builder.compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    public String extractUsername(String token) {
        return (String) extractAllClaims(token).get("username");
    }

    public String extractUserId(String token) {
        return (String) extractAllClaims(token).get("userId");
    }

    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token, String username, String userId) {
        final String extractedUsername = extractUsername(token);
        final String extractedUserId = extractUserId(token);
        return (extractedUsername.equals(username) && extractedUserId.equals(userId) && !isTokenExpired(token));
    }
}