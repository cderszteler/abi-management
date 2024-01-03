package derszteler.abimanagement.user;

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
  name = "User",
  description = "Endpoints to access and mutate users"
)
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1/user")
@RestController
public final class UserRestEndpoint {
  private final UserService service;

  @Operation(
    summary = "Create user",
    description = """
      This endpoint is used to create a new user. It can be only accessed with
      the `Admin` role.

      The user is created with the `Default` role. A reset token with an expiry
      time of one week is automatically created, too.
      """,
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      content = @Content(schema = @Schema(implementation = CreateUserRequest.class)),
      description = "The user to be created",
      required = true
    ),
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The request body is invalid.",
        responseCode = "400"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "A user with this username already exists",
        responseCode = "409"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = User.class)),
        description = "The created user",
        responseCode = "200"
      )
    }
  )
  @PostMapping(produces = "application/json")
  public ResponseEntity<User> createUser(
    @RequestBody CreateUserRequest request
  ) {
    if (!request.valid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid body");
    }

    return ResponseEntity.ok(service.create(request));
  }
}