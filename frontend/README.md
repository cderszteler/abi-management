# Abi Management - Frontend

This is the frontend of the application developed with NextJS and TailwindCSS.
Authentication is handled via NextJS and the custom backend.

## Environment variables

| **Variable**      | **Description**                                                                                         | **Accepted Values** | **Example**                                    |
|-------------------|---------------------------------------------------------------------------------------------------------|---------------------|------------------------------------------------|
| `NEXTAUTH_URL`    | The base url the server is running on.                                                                  | String              | `http://localhost:3000`                        |
| `NEXTAUTH_SECRET` | The JWT-secret used by NextAuth to sign JWT keys. E.g., can be generated with `openssl rand -base64 32` | String              | `LkFby8v35raVplZDbetrAev0u13+KBEm6zhuCmYbvNA=` |
| `BACKEND_URL`     | The url to the backend used for API calls.                                                              | String              | `http://localhost:5000`                        |