package derszteler.abimanagement.user;

import io.swagger.v3.oas.annotations.media.Schema;

public record CreateUserRequest(
  @Schema(description = "The first name of the user", example = "Christoph")
  String firstName,
  @Schema(description = "The last name of the user", example = "Derszteler")
  String lastName,
  @Schema(
    description = "The username of the user used for authentication. This must be unique.",
    example = "christoph.derszteler"
  )
  String username
) {
  boolean valid() {
    return validString(firstName)
      && validString(lastName)
      && validString(username);
  }

  private boolean validString(String string) {
    return string != null && !string.isBlank();
  }
}