package derszteler.abimanagement.security;

public record RefreshTokenRequest(String refreshToken) {
  public boolean valid() {
    return refreshToken != null && !refreshToken.isBlank();
  }
}