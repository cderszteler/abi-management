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
  private static final String usernameRegex = "[a-zA-Z0-9.]{4,}";

  public boolean valid() {
    return (username != null && !username.isBlank() && username.matches(usernameRegex))
      && validPassword(password);
  }

  public static boolean validPassword(String password) {
    return password != null && !password.isBlank()
      && password.length() >= 8 && password.length() <= 100;
  }
}