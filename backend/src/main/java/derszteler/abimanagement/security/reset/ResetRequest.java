package derszteler.abimanagement.security.reset;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

public record ResetRequest(
  @Schema(
    description = "The token to reset the user with",
    example = "79b2feaf-7ae2-48d2-9ef7-cad86996a6cf"
  )
  String token
) {
  UUID tokenAsId() {
    return UUID.fromString(token);
  }

  private static final String uuidFormat =
    "^[0-9a-fA-F]{8}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{4}\\b-[0-9a-fA-F]{12}$";

  boolean valid() {
    return token != null && token.matches(uuidFormat);
  }
}