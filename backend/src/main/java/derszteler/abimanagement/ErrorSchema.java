package derszteler.abimanagement;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.OffsetDateTime;

@Schema(description = "The default error response body")
public record ErrorSchema(
  @Schema(
    description = "The timestamp the error was thrown",
    example = "2023-11-26T10:14:46.171+00:00"
  )
  OffsetDateTime timestamp,
  @Schema(
    description = "The error code of the response",
    example = "999"
  )
  int status,
  @Schema(
    description = "A detailed description or identifier of the error",
    example = "description"
  )
  String error,
  @Schema(
    description = "The path of the request",
    example = "/api/v1/..."
  )
  String path
) {}