package com.pkcedemo.backend.service.impl;

import com.pkcedemo.backend.model.dto.UserRegistrationDto;
import com.pkcedemo.backend.model.entity.User;
import com.pkcedemo.backend.repository.UserRepository;
import com.pkcedemo.backend.service.KeycloakUserService;
import com.pkcedemo.backend.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserManagementServiceImpl implements UserManagementService {

    private final KeycloakUserService keycloakUserService;
    private final UserRepository userRepository;

    /**
     * Register a new user in both Keycloak and internal database
     */
    @Transactional
    @Override
    public User registerUser(UserRegistrationDto registrationDto) {

        // 1. Validate user doesn't exist
        if (userRepository.existsByUsername(registrationDto.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(registrationDto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String keycloakUserId = null;

        try {
            // 2. Create user in Keycloak
            keycloakUserId = keycloakUserService.createUser(
                    registrationDto.getUsername(),
                    registrationDto.getEmail(),
                    registrationDto.getPassword(),
                    registrationDto.getFirstName(),
                    registrationDto.getLastName(),
                    registrationDto.getRole() != null ? registrationDto.getRole() : "BASIC"
            );

            // 3. Create user in internal database
            User user = new User();
            user.setUsername(registrationDto.getUsername());
            user.setEmail(registrationDto.getEmail());
            user.setFirstName(registrationDto.getFirstName());
            user.setLastName(registrationDto.getLastName());
            user.setKeycloakUserId(keycloakUserId);
            user.setActive(true);

            User savedUser = userRepository.save(user);
            log.info("Successfully registered user: {}", savedUser.getUsername());

            return savedUser;

        } catch (Exception e) {
            log.error("Failed to register user", e);

            // Rollback: Delete from Keycloak if DB save fails
            if (keycloakUserId != null) {
                try {
                    keycloakUserService.deleteUser(keycloakUserId);
                    log.info("Rolled back Keycloak user creation");
                } catch (Exception rollbackException) {
                    log.error("Failed to rollback Keycloak user creation", rollbackException);
                }
            }

            throw new RuntimeException("Failed to register user: " + e.getMessage(), e);
        }
    }

    /**
     * Delete user from both systems
     */
    @Transactional
    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            // Delete from Keycloak
            keycloakUserService.deleteUser(user.getKeycloakUserId());

            // Delete from internal DB
            userRepository.delete(user);

            log.info("Successfully deleted user: {}", user.getUsername());
        } catch (Exception e) {
            log.error("Failed to delete user", e);
            throw new RuntimeException("Failed to delete user: " + e.getMessage(), e);
        }
    }
}
