package derszteler.abimanagement.security;

import io.swagger.v3.oas.annotations.media.Schema;

public record AuthenticationRequest(
  @Schema(
    description = "The username to authenticate with",
    example = "christoph.derszteler"
  ) String username,
  @Schema(
    description = "The password to authenticate with",
    example = "D&Uy=(P@BaApA&fL"
  ) String password
) {
  private static final String emailRegex = "^(?=.{1,64}@)[A-Za-z0-9_-]" +
    "+(\\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)" +
    "*(\\.[A-Za-z]{2,})$";

  public boolean valid() {
    return (username != null && !username.isBlank() && username.matches(emailRegex))
      && (password != null && !password.isBlank()
        && password.length() >= 8 && password.length() <= 100
      );
  }
}