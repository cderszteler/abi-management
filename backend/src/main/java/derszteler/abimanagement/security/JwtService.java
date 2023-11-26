package derszteler.abimanagement.security;

import com.google.common.base.Preconditions;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Component
@Slf4j
public final class JwtService {
  private final UserDetailsService detailsService;
  private final JwtParser jwtParser;
  @Qualifier("development")
  private final boolean development;

  public Optional<UserDetails> findValidDetailsByToken(String token) {
    try {
      var claims = parseClaims(token);
      return Optional.ofNullable(claims.getSubject())
        .map(detailsService::loadUserByUsername)
        .filter(details -> isTokenValid(claims, details));
    } catch (JwtException | UsernameNotFoundException invalidToken) {
      return Optional.empty();
    }
  }

  private boolean isTokenValid(Claims claims, UserDetails details) {
    var username = claims.getSubject();
    return username.equals(details.getUsername()) && !isExpired(claims);
  }

  private boolean isExpired(Claims claims) {
    return claims.getExpiration().before(new Date());
  }

  private Claims parseClaims(String token) throws JwtException {
    return jwtParser.parseSignedClaims(token).getPayload();
  }

  private static final String header = AUTHORIZATION;
  static final String cookieName = "auth-token";

  public Optional<String> filterForTokenInRequest(
    HttpServletRequest request
  ) {
    Preconditions.checkNotNull(request, "request");
    if (development) {
      return filterForTokenInHeader(request.getHeader(header)).or(() -> Arrays
        .stream(Objects.requireNonNullElse(request.getCookies(), new Cookie[0]))
        .filter(cookie -> cookie.getName().equals(cookieName))
        .findFirst()
        .map(Cookie::getValue)
      );
    }
    return filterForTokenInHeader(request.getHeader(header));
  }

  private Optional<String> filterForTokenInHeader(String header) {
    return Optional.ofNullable(header)
      .filter(existing -> existing.startsWith("Bearer "))
      .map(existing -> existing.substring(7));
  }
}