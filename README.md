# PKCE Demo

This project demonstrates OAuth 2.1 PKCE (Proof Key for Code Exchange) authentication end to end using:
- Keycloak (as the Authorization Server / OpenID Provider)
- Spring (Backend API)
- React (Frontend SPA)
- PostgreSQL (data store)

The repository is organized as a two-module setup:
- Frontend: React single-page application that initiates the PKCE flow and consumes the secured API.
- Backend: Spring-based REST API secured with OAuth 2.1 / OpenID Connect, validating tokens from Keycloak and persisting data in PostgreSQL.

## What you'll learn
- How PKCE hardens the Authorization Code flow for public clients (SPAs and native apps).
- How to configure a Keycloak realm, client, and roles for a PKCE-capable SPA.
- How to integrate Spring security with an external OpenID Provider and validate JWTs.
- How to call a protected API from a React app with proper token handling and refresh.

## Tech stack
- React (SPA)
- Spring (Boot/Security, REST)
- Keycloak (OpenID Provider)
- PostgreSQL (RDBMS)

## Repository layout
- Backend/ — Spring application (secure REST API, JWT validation)
- Frontend/ — React application (PKCE-capable OAuth client)

## Prerequisites
- JDK (for the Spring backend)
- Node.js + a package manager (npm, yarn, or pnpm) for the React frontend
- Docker (recommended) for running Keycloak and PostgreSQL locally

## High-level flow
1. The React app (public client) initiates Authorization Code + PKCE with Keycloak.
2. Keycloak authenticates the user and returns an authorization code.
3. The React app exchanges the code (with code_verifier) for tokens.
4. API requests include the access token to the Spring backend.
5. The backend validates the token signature and claims issued by Keycloak and serves protected resources backed by PostgreSQL.
