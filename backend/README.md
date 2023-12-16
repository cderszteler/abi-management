# Abi Management - Backend

This is the backend of the main application developed with Spring Boot 3.
It includes JWT authentication as well as REST endpoints to support core functionality.

## Environment variables

| **Variable**           | **Description**                                                                        | **Accepted Values** | **Example**                                    |
|------------------------|----------------------------------------------------------------------------------------|---------------------|------------------------------------------------|
| `PORT`                 | The port the application is running on.                                                | Number              | `5000`                                         |
| `DATABASE_HOST`        | The host and port of the database.                                                     | String              | `localhost:5432`                               |
| `DATABASE_DATABASE`    | The database name of the Postgres database.                                            | String              | `abi-management`                               |
| `DATABASE_USERNAME`    | The username to authenticate with the database.                                        | String              | `abi-management`                               |
| `DATABASE_PASSWORD`    | The password to authenticate with the database.                                        | String              | `jqduv6zNgV2KUSwf`                             |
| `JWT_SECRET`           | The JWT-secret to sign JWT keys. E.g., can be generated with `openssl rand -base64 32` | String              | `LkFby8v35raVplZDbetrAev0u13+KBEm6zhuCmYbvNA=` |
| `CORS_ALLOWED_ORIGINS` | A list of allowed origins for CORS, separated with a semicolon                         | String              | `localhost;https://example.com`                |