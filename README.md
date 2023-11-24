# Abi Management

This application is the backend-side for the management of my last school year.
Its main purpose is to review student's and teacher's quotes.
Thus, an authentication and authorization layer as well as other core functionalities
have to be implemented.

## Environment variables

| **Variable**           | **Description**                                                                     | **Accepted Values** | **Example**                     |
|------------------------|-------------------------------------------------------------------------------------|---------------------|---------------------------------|
| `PORT`                 | The port the application is running on.                                             | Number              | `80`                            |
| `DATABASE_HOST`        | The host and port of the database.                                                  | String              | `localhost:5432`                |
| `DATABASE_DATABASE`    | The database name of the Postgres database.                                         | String              | `abi-management`                |
| `DATABASE_USERNAME`    | The username to authenticate with the database.                                     | String              | `abi-management`                |
| `DATABASE_PASSWORD`    | The password to authenticate with the database.                                     | String              | `jqduv6zNgV2KUSwf`              |
| `JWT_SECRET`           | The JWT-secret to sign JWT keys. E.g., can be generated with `openssl rand -hex 32` | String              | `jqduv6zNgV2KUSwf`              |
| `CORS_ALLOWED_ORIGINS` | A list of allowed origins for CORS, separated with a semicolon                      | String              | `localhost;https://example.com` |