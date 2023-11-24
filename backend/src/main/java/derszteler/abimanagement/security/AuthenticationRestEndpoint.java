package derszteler.abimanagement.security;

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

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1/auth")
@RestController
public final class AuthenticationRestEndpoint {
  private final AuthenticationService service;

  @PostMapping("/authenticate")
  public ResponseEntity<TokenPair> authenticate(
    @RequestBody AuthenticationRequest request
  ) {
    if (!request.valid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid request");
    }

    return ResponseEntity.ok(service.authenticate(request));
  }

  @PostMapping("/refresh")
  public ResponseEntity<TokenPair> refreshToken(
    @RequestBody RefreshTokenRequest request
  ) {
    if (!request.valid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid request");
    }

    return ResponseEntity.ok(service.refreshToken(request));
  }
}