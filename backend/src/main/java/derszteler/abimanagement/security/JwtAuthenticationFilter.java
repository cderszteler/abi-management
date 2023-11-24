package derszteler.abimanagement.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import static org.springframework.security.core.context.SecurityContextHolder.getContext;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Component
public final class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtService service;

  @SuppressWarnings("NullableProblems")
  @Override
  protected void doFilterInternal(
    HttpServletRequest request,
    HttpServletResponse response,
    FilterChain filterChain
  ) throws ServletException, IOException {
    var token = service.filterForTokenInRequest(request).orElse(null);
    if (token == null) {
      filterChain.doFilter(request, response);
      return;
    }

    authenticate(token, request);
    filterChain.doFilter(request, response);
  }

  private void authenticate(String token, HttpServletRequest request) {
    if (getContext().getAuthentication() != null) {
      return;
    }
    service.findValidDetailsByToken(token)
      .ifPresent(details -> grantAuthentication(details, request));
  }

  private void grantAuthentication(UserDetails details, HttpServletRequest request) {
    var authToken = new UsernamePasswordAuthenticationToken(
      details,
      null,
      details.getAuthorities()
    );
    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
    getContext().setAuthentication(authToken);
  }
}