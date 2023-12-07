package derszteler.abimanagement.security;

import derszteler.abimanagement.user.User;
import io.swagger.v3.oas.annotations.media.Schema;

public record AuthenticationResponse(
  @Schema(description = "The tokens generated after successfully authenticating")
  TokenPair tokens,
  @Schema(description = "The authenticated user")
  User user
) {}