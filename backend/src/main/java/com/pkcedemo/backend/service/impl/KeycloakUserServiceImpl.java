package com.pkcedemo.backend.service.impl;

import com.pkcedemo.backend.service.KeycloakUserService;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class KeycloakUserServiceImpl implements KeycloakUserService {

    private final Keycloak keycloak;

    @Value("${keycloak.admin.target-realm}")
    private String targetRealm;

    /**
     * Create a user in Keycloak
     */
    @Override
    public String createUser(String username, String email, String password,
                             String firstName, String lastName, String role) {

        RealmResource realmResource = keycloak.realm(targetRealm);
        UsersResource usersResource = realmResource.users();

        // Create user representation
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEnabled(true);
        user.setEmailVerified(false);

        // Create user
        Response response = usersResource.create(user);

        if (response.getStatus() != 201) {
            log.error("Failed to create user in Keycloak. Status: {}, Body: {}",
                    response.getStatus(), response.readEntity(String.class));
            throw new RuntimeException("Failed to create user in Keycloak: " + response.getStatusInfo());
        }

        // Extract user ID from location header
        String locationHeader = response.getHeaderString("Location");
        String userId = locationHeader.substring(locationHeader.lastIndexOf('/') + 1);
        log.info("Created Keycloak user with ID: {}", userId);

        // Set password
        setUserPassword(userId, password);

        // Assign role
        if (role != null && !role.isEmpty()) {
            assignRole(userId, role);
        }

        response.close();
        return userId;
    }

    /**
     * Set user password
     */
    @Override
    public void setUserPassword(String userId, String password) {
        RealmResource realmResource = keycloak.realm(targetRealm);
        UserResource userResource = realmResource.users().get(userId);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false); // User won't be forced to change the password

        userResource.resetPassword(credential);
        log.info("Password set for user ID: {}", userId);
    }

    /**
     * Assign role to user
     */
    @Override
    public void assignRole(String userId, String roleName) {
        RealmResource realmResource = keycloak.realm(targetRealm);
        UserResource userResource = realmResource.users().get(userId);

        // Get realm role
        RoleRepresentation role = realmResource.roles().get(roleName).toRepresentation();

        // Assign role to user
        userResource.roles().realmLevel().add(Collections.singletonList(role));
        log.info("Assigned role '{}' to user ID: {}", roleName, userId);
    }

    /**
     * Delete user from Keycloak
     */
    @Override
    public void deleteUser(String userId) {
        RealmResource realmResource = keycloak.realm(targetRealm);
        realmResource.users().delete(userId);
        log.info("Deleted user ID: {}", userId);
    }

    /**
     * Update user in Keycloak
     */
    @Override
    public void updateUser(String userId, String email, String firstName, String lastName) {
        RealmResource realmResource = keycloak.realm(targetRealm);
        UserResource userResource = realmResource.users().get(userId);

        UserRepresentation user = userResource.toRepresentation();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);

        userResource.update(user);
        log.info("Updated user ID: {}", userId);
    }

    /**
     * Get user by username
     */
    @Override
    public UserRepresentation getUserByUsername(String username) {
        RealmResource realmResource = keycloak.realm(targetRealm);
        List<UserRepresentation> users = realmResource.users().search(username, true);

        if (users.isEmpty()) {
            return null;
        }

        return users.get(0);
    }

    /**
     * Enable/Disable user
     */
    @Override
    public void setUserEnabled(String userId, boolean enabled) {
        RealmResource realmResource = keycloak.realm(targetRealm);
        UserResource userResource = realmResource.users().get(userId);

        UserRepresentation user = userResource.toRepresentation();
        user.setEnabled(enabled);

        userResource.update(user);
        log.info("Set user ID {} enabled: {}", userId, enabled);
    }
}
