-- Keycloak DB + user
CREATE
USER keycloak_user WITH ENCRYPTED PASSWORD 'keycloak_password';
CREATE
DATABASE keycloak_db OWNER keycloak_user;

\connect
keycloak_db

-- Ensure schema ownership and privileges for Keycloak
ALTER
SCHEMA public OWNER TO keycloak_user;
GRANT USAGE, CREATE
ON SCHEMA public TO keycloak_user;
ALTER
DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO keycloak_user;
ALTER
DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO keycloak_user;

-- Backend DB + user
CREATE
USER app_user WITH ENCRYPTED PASSWORD 'app_password';
CREATE
DATABASE app_db OWNER app_user;

\connect
app_db

-- Ensure schema ownership and privileges for the app DB
ALTER
SCHEMA public OWNER TO app_user;
GRANT USAGE, CREATE
ON SCHEMA public TO app_user;
ALTER
DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_user;
ALTER
DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO app_user;