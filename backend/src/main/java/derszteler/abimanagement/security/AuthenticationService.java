package derszteler.abimanagement.security;

import com.google.common.collect.Maps;
import derszteler.abimanagement.user.User;
import derszteler.abimanagement.user.UserRepository;
import io.jsonwebtoken.Jwts;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.SecretKey;
import java.util.Date;

import static java.util.concurrent.TimeUnit.DAYS;
import static java.util.concurrent.TimeUnit.HOURS;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Service
public final class AuthenticationService {
  private final AuthenticationManager manager;
  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final SecretKey key;

  private static final ResponseStatusException invalidCredentials = new ResponseStatusException(
    HttpStatus.FORBIDDEN,
    "Invalid credentials"
  );

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    try {
      manager.authenticate(new UsernamePasswordAuthenticationToken(
        request.username(), request.password()
      ));
    } catch (AuthenticationException invalidCredentialsFailure) {
      throw invalidCredentials;
    }

    var user = userRepository.findByUsername(request.username())
      .orElseThrow(() -> invalidCredentials);
    return new AuthenticationResponse(createTokenPair(user));
  }

  TokenPair createTokenPair(User user) {
    return new TokenPair(createAccessToken(user), createRefreshToken(user));
  }

  private String createAccessToken(User user) {
    return Jwts.builder()
      .claims(Maps.newHashMap())
      .subject(user.username())
      .claim("authorities", user.getAuthorities())
      .issuedAt(new Date(System.currentTimeMillis()))
      .expiration(new Date(System.currentTimeMillis() + HOURS.toMillis(24)))
      .signWith(key)
      .compact();
  }

  private String createRefreshToken(User user) {
    return Jwts.builder()
      .claims(Maps.newHashMap())
      .subject(user.username())
      .claim("authorities", user.getAuthorities())
      .issuedAt(new Date(System.currentTimeMillis()))
      .expiration(new Date(System.currentTimeMillis() + DAYS.toMillis(30)))
      .signWith(key)
      .compact();
  }

  public TokenPair refreshToken(RefreshTokenRequest request) {
    try {
      var user = jwtService.findValidDetailsByToken(request.refreshToken())
        .flatMap(existing -> userRepository.findByUsername(existing.getUsername()))
        .orElseThrow(() -> invalidCredentials);
      return new TokenPair(createAccessToken(user), request.refreshToken());
    } catch (UsernameNotFoundException unknownUser) {
      throw invalidCredentials;
    }
  }
}