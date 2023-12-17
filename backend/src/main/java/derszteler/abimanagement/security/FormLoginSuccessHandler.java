package derszteler.abimanagement.security;

import derszteler.abimanagement.user.User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Component
public final class FormLoginSuccessHandler implements AuthenticationSuccessHandler {
  private final AuthenticationService service;

  @Override
  public void onAuthenticationSuccess(
    HttpServletRequest request,
    HttpServletResponse response,
    Authentication authentication
  ) throws IOException {
    var user = (User) authentication.getPrincipal();
    var token = service.createTokenPair(user);

    var cookie = new Cookie(JwtService.cookieName, token.accessToken());
    cookie.setMaxAge((int) TimeUnit.DAYS.toSeconds(1));
    cookie.setHttpOnly(true);
    cookie.setSecure(true);
    response.addCookie(cookie);
    response.sendRedirect("docs/swagger-ui/index.html#/");
  }
}