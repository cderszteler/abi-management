package derszteler.abimanagement.security.reset;

import derszteler.abimanagement.ErrorSchema;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@Tag(
  name = "Authentication",
  description = "Endpoints to authenticate via given credentials to receive JWT tokens"
)
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1/auth/reset")
@RestController
public final class ResetTokenRestEndpoint {
  private final ResetTokenService service;

  @Operation(
    summary = "Reset user with token",
    description = """
      This endpoint is used to reset a user's password with a specified reset token.

      The token is be provided individually and normally expires one day after issue.
      """,
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      content = @Content(schema = @Schema(implementation = ResetRequest.class)),
      description = "The token used to reset the user",
      required = true
    ),
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The specified token is not valid.",
        responseCode = "400"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The reset token was not found. It might be expired already.",
        responseCode = "404"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The token has expired",
        responseCode = "410"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema()),
        description = "Reset the user's password",
        responseCode = "200"
      )
    }
  )
  @PostMapping(produces = "application/json")
  public ResponseEntity<Void> resetWithToken(
    @RequestBody ResetRequest request
  ) {
    if (!request.valid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
    }

    service.resetWithToken(request);
    return ResponseEntity.ok().build();
  }
}