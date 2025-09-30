package com.pkcedemo.backend.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@Slf4j
public class DebugController {

    @GetMapping("/auth")
    public Map<String, Object> getAuthInfo(Authentication authentication) {
        Map<String, Object> info = new HashMap<>();

        info.put("name", authentication.getName());
        info.put("authenticated", authentication.isAuthenticated());

        info.put("authorities", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList());

        // If JWT, show raw claims
        if (authentication.getPrincipal() instanceof Jwt jwt) {
            info.put("jwt_subject", jwt.getSubject());
            info.put("jwt_claims", jwt.getClaims());
        }

        return info;
    }
}