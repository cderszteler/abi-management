package derszteler.abimanagement.security;

import com.google.common.collect.Lists;
import derszteler.abimanagement.user.UserRepository;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.List;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

@RequiredArgsConstructor
@EnableWebSecurity
@Configuration
public class SecurityConfiguration {
  @Value("${cors.allow-all-origins}")
  private boolean corsAllowAllOrigins;

  @Bean
  SecurityFilterChain buildSecurityFilterChain(
    JwtAuthenticationFilter jwtAuthenticationFilter,
    FormLoginSuccessHandler formLoginSuccessHandler,
    @Qualifier("development") boolean development,
    AuthenticationProvider provider,
    HttpSecurity builder
  ) throws Exception {
    return builder
      .csrf(AbstractHttpConfigurer::disable)
      .cors(customizer -> customizer.configurationSource(buildCorsConfiguration()))
      .authorizeHttpRequests(customizer -> customizer
        .dispatcherTypeMatchers(DispatcherType.ASYNC)
        .permitAll()
        .requestMatchers(
          antMatcher("/error")
        )
        .permitAll()
        .requestMatchers(
          antMatcher("/api/v1/user/password/{requestToken}"),
          antMatcher("/api/v1/auth/**"),
          antMatcher(HttpMethod.POST, "/api/v1/user/password")
        )
        .anonymous()
        .anyRequest()
        .authenticated()
      )
      .formLogin(customizer -> {
        if (!development) {
          customizer.disable();
          return;
        }
        customizer.successHandler(formLoginSuccessHandler);
      })
      .sessionManagement(customizer -> customizer.sessionCreationPolicy(
        SessionCreationPolicy.STATELESS
      ))
      .exceptionHandling(customizer -> customizer.defaultAuthenticationEntryPointFor(
        new Http403ForbiddenEntryPoint(), new AntPathRequestMatcher("/api/**")
      ))
      .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
      .authenticationProvider(provider)
      .build();
  }

  private CorsConfigurationSource buildCorsConfiguration() {
    var configuration = new CorsConfiguration();
    configuration.setAllowedMethods(List.of("*"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowedOrigins(findAllowedOrigins());

    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  private List<String> findAllowedOrigins() {
    if (corsAllowAllOrigins) {
      return List.of("*");
    }
    return Lists.newArrayList(System.getenv("CORS_ALLOWED_ORIGINS").split(";"));
  }

  @Bean
  AuthenticationProvider buildAuthenticationProvider(
    PasswordEncoder passwordEncoder,
    UserRepository repository
  ) {
    var provider = new DaoAuthenticationProvider();
    provider.setPasswordEncoder(passwordEncoder);
    provider.setUserDetailsService(repository);
    return provider;
  }

  @Bean
  AuthenticationManager buildAuthenticationManager(
    AuthenticationConfiguration configuration
  ) throws Exception {
    return configuration.getAuthenticationManager();
  }

  @Bean
  PasswordEncoder bindPasswordEncoder() {
    return new BCryptPasswordEncoder();
  }

  private static final String jwtSecret = System.getenv("JWT_SECRET");

  @Bean
  SecretKey bindKey() {
    return Keys.hmacShaKeyFor(Base64.getDecoder().decode(jwtSecret));
  }

  @Bean
  JwtParser jwtParser(SecretKey key) {
    return Jwts.parser()
      .verifyWith(key)
      .build();
  }
}