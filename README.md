# PKCE Demo

This project demonstrates OAuth 2.1 PKCE (Proof Key for Code Exchange) authentication end to end using:

- Keycloak (as the Authorization Server / OpenID Provider)
- Spring (Backend API)
- React (Frontend SPA)
- PostgreSQL (data store)

The repository is organized as a two-module setup:

- Frontend: React a single-page application that initiates the PKCE flow and consumes the secured API.
- Backend: Spring-based REST API secured with OAuth 2.1 / OpenID Connect, validating tokens from Keycloak and persisting
  data in PostgreSQL.

## What you'll learn

- How PKCE hardens the Authorization Code flow for public clients (SPAs and native apps).
- How to configure a Keycloak realm, client, and roles for a PKCE-capable SPA.
- How to integrate Spring security with an external OpenID Provider and validate JWTs.
- How to call a protected API from a React app with proper token handling and refresh.

## Prerequisites

- JDK (for the Spring backend)
- Node.js + a package manager (npm, yarn, or pnpm) for the React frontend
- Docker (recommended) for running Keycloak and PostgreSQL locally

## Tech stack

- React (SPA)
- Spring (Boot/Security, REST)
- Keycloak (OpenID Provider)
- PostgreSQL (RDBMS)

## Learning Points

- Step 0:
    - [x] Architecture diagram

- Step 1:
    - [x] Docker
    - [x] Docker images ([Hub](https://hub.docker.com/r/keycloak/keycloak)
      vs [Query](https://quay.io/repository/keycloak/keycloak/))
    - [x] Docker volume
    - [x] Docker compose

- Step 2:
    - [x] Keycloak
    - [x] Keycloak user
    - [x] Keycloak realm
    - [x] Keycloak client
    - [x] Keycloak pkce/config

- Step 3:
    - [X] React Auth libs
    - [X] Impl basic `PKCE` flow
    - [X] Single Tab strategy
    - [X] Update login UI in the `Keycloak`
        - [X] Option 1: `using Keycloakify starter`
            - [Link](https://docs.keycloakify.dev/)
            - Simple to integrate
            - Limited customization
        - [X] Option 2: `using Keycloakify into our code-base`
            - [Link](https://docs.keycloakify.dev/integration-keycloakify-in-your-codebase/vite)
            - Harder to integrate
            - Quick customization
        - [X] Documents:
            - [Keycloakify](https://github.com/keycloakify/keycloakify)
            - [Apache FreeMarker](https://freemarker.apache.org/index.html)

- Step 4:
    - [X] Spring App (Resource Server)
        - [X] Realm Role
        - [X] App Access
            ```java
            @RestController
            @RequestMapping("/api/workspaces")
            public class WorkspaceController {
                
                // Level 1: Keycloak role check (only Creators and Admins can create workspaces)
                @PostMapping
                @PreAuthorize("hasAnyRole('CREATOR', 'ADMIN')")
                public ResponseEntity<?> createWorkspace(@RequestBody WorkspaceDto dto) {
                    // Business logic
                }
                
                // Level 2: Workspace-level access check (only Owners can delete)
                @DeleteMapping("/{workspaceId}")
                @RequireWorkspaceAccess(WorkspaceAccess.OWNER)
                public ResponseEntity<?> deleteWorkspace(@PathVariable String workspaceId) {
                    // Business logic
                }
                
                // Combined: Must be Admin OR Creator role + Editor/Owner in workspace
                @PutMapping("/{workspaceId}/settings")
                @PreAuthorize("hasAnyRole('CREATOR', 'ADMIN')")
                @RequireWorkspaceAccess({WorkspaceAccess.OWNER, WorkspaceAccess.EDITOR})
                public ResponseEntity<?> updateSettings(
                        @PathVariable String workspaceId,
                        @RequestBody SettingsDto settings) {
                    // Business logic
                }
            }
            ```
    - [X] Secure APIs
      - Caching Strategy
      - Audit Logging
      - API Design
    - [X] Signup API

- Step 5:
    - [ ] BFF scenario
