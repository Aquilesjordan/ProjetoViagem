package com.challenge.viagensbackend.config.security;

import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
   private final SecretKey secretKey;
   private final long expirationSeconds;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.expiration-seconds:28800}") long expirationSeconds) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("O secretKey deve ter pelo menos 32 caracteres!");
        }
        if (expirationSeconds <= 0) {
            throw new IllegalStateException("security.jwt.expiration-seconds deve ser maior que zero");
        }
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationSeconds = expirationSeconds;
    }

    public String generateToken(UserDetailsImpl user) {
        Instant now = Instant.now();
        Instant expire = now.plusSeconds(expirationSeconds);

        return Jwts.builder()
            .setSubject(user.getUsername())
            .claim("id", user.getId())
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(expire))
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token, UserDetails user) {
        String username = extractUsername(token);
        return username.equals(user.getUsername());
    }
}
