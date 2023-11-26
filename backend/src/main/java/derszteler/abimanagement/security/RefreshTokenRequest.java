package derszteler.abimanagement.security;

import io.swagger.v3.oas.annotations.media.Schema;

public record RefreshTokenRequest(
  @Schema(
    description = "The refresh token used to generate a new access token",
    example = TokenPair.exampleToken
  ) String refreshToken
) {
  public boolean valid() {
    return refreshToken != null && !refreshToken.isBlank();
  }
}