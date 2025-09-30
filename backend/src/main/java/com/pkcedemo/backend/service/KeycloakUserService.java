package com.pkcedemo.backend.service;

import org.keycloak.representations.idm.UserRepresentation;

public interface KeycloakUserService {
    String createUser(String username, String email, String password, String firstName, String lastName, String role);

    void setUserPassword(String userId, String password);

    void assignRole(String userId, String roleName);

    void deleteUser(String userId);

    void updateUser(String userId, String email, String firstName, String lastName);

    UserRepresentation getUserByUsername(String username);

    void setUserEnabled(String userId, boolean enabled);
}
