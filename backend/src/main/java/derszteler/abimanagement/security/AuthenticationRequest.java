package derszteler.abimanagement.security;

public record AuthenticationRequest(
  String username,
  String password
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