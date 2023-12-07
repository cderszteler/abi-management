package derszteler.abimanagement.security;

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
@RequestMapping("/api/v1/auth")
@RestController
public final class AuthenticationRestEndpoint {
  private final AuthenticationService service;

  @Operation(
    summary = "Authenticate with credentials to receive JWT tokens",
    description = """
      This endpoint is used to authenticate with the backend with specified
      credentials in the request body.

      If the authentication is successful, a `AuthenticationResponse` will be returned.
      It includes the access and refresh token as well as the executing user
      (for more information, view the response body).
      """,
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      content = @Content(schema = @Schema(implementation = AuthenticationRequest.class)),
      description = "The credentials to authenticate with",
      required = true
    ),
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The specified credentials are invalid (in terms of Regex)",
        responseCode = "400"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The specified credentials are invalid " +
          "(in terms of wrong password, user does not exist, etc.)",
        responseCode = "403"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = AuthenticationResponse.class)),
        description = "Upon successful authentication: JWT tokens and user",
        responseCode = "200"
      )
    }
  )
  @PostMapping(value = "/authenticate", produces = "application/json")
  public ResponseEntity<AuthenticationResponse> authenticate(
    @RequestBody AuthenticationRequest request
  ) {
    if (!request.valid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid request");
    }

    return ResponseEntity.ok(service.authenticate(request));
  }

  @Operation(
    summary = "Refresh access token with refresh token",
    description = """
      This endpoint is used to refresh the expired access token with a valid refresh
      token specified in the request body.

      If the refresh token is still valid, a `TokenPair` will be returned.
      It does not include a **new** refresh token.
      """,
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      content = @Content(schema = @Schema(implementation = AuthenticationRequest.class)),
      description = "The credentials to authenticate with",
      required = true
    ),
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The specified refresh token is invalid (in terms of Regex)",
        responseCode = "400"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The specified refresh token is expired or the user has been deleted.",
        responseCode = "403"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = TokenPair.class)),
        description = "New access token",
        responseCode = "200"
      )
    }
  )
  @PostMapping(value = "/refresh",produces = "application/json")
  public ResponseEntity<TokenPair> refreshToken(
    @RequestBody RefreshTokenRequest request
  ) {
    if (!request.valid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid request");
    }

    return ResponseEntity.ok(service.refreshToken(request));
  }
}