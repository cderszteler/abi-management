package derszteler.abimanagement.user.dashboard;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

public record DisplayUser(
  @Schema(description = "The id of the user", example = "1")
  int id,
  @JsonIgnore
  String firstName,
  @JsonIgnore
  String lastName
) {
  @Schema(description = "The display name of the user", example = "Christoph Derszteler")
  @JsonProperty
  public String displayName() {
    return "%s %s".formatted(firstName, lastName);
  }
}