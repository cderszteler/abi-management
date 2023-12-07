package derszteler.abimanagement.security;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;

@Schema
public record TokenPair(
  @Schema(
    description = "JWT access token, used to authenticate other requests. " +
      "Expires in 1 day after issuing.",
    example = TokenPair.exampleToken
  )
  String accessToken,
  @Schema(
    description = "JWT refresh token, expires in 30 days after issuing. " +
      "New one is only specified if fully authenticating (not refreshing access token).",
    nullable = true
  )
  @Nullable String refreshToken
) {
  static final String exampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
    ".eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNocmlzdG9waCBEZXJzenRlbGVyIiwiaWF0IjoxNTE2MjM5MDIyfQ" +
    ".ZYSFEWwO0HYbQhs3vDdcY3gOCl0BAcWKT30hpmwsPeM";
}