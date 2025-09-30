package com.pkcedemo.backend.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class KeycloakJwtAuthenticationConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private final JwtGrantedAuthoritiesConverter defaultGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        // Get default authorities from scope claims
        Collection<GrantedAuthority> authorities = defaultGrantedAuthoritiesConverter.convert(jwt);

        // Extract realm roles from Keycloak JWT
        Collection<GrantedAuthority> realmRoles = extractRealmRoles(jwt);

        // Combine both
        return Stream.concat(authorities.stream(), realmRoles.stream())
                .collect(Collectors.toSet());
    }

    private Collection<GrantedAuthority> extractRealmRoles(Jwt jwt) {
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");

        if (realmAccess == null) {
            return List.of();
        }

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) realmAccess.get("roles");

        if (roles == null || roles.isEmpty()) {
            return List.of();
        }

        // Transform Keycloak roles to Spring Security authorities
        // "admin" -> "ROLE_ADMIN", "offline_access" -> "ROLE_OFFLINE_ACCESS"
        return roles.stream()
                .filter(role -> !role.startsWith("default-roles-")) // Filter out default roles
                .map(role -> "ROLE_" + role.toUpperCase().replace("-", "_"))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}