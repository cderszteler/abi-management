package derszteler.abimanagement.security;

import com.google.common.collect.Maps;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.user.User;
import io.jsonwebtoken.Jwts;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;

import javax.crypto.SecretKey;
import java.util.Date;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest
@ContextConfiguration(classes = Application.class)
@TestPropertySource(locations = "classpath:application-testing.properties")
@Import(AuthenticationConfiguration.class)
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Slf4j
public final class JwtServiceTest {
  private final AuthenticationService authenticationService;
  private final JwtService jwtService;
  private final User primaryUser;
  private final SecretKey key;

  private TokenPair tokenPair;

  @BeforeAll
  void createUser() {
    tokenPair = authenticationService.createTokenPair(primaryUser);
  }

  @Order(1)
  @Test
  void testFindDetailsByToken() {
    var expiredToken = createExpiredToken(primaryUser);
    var details = jwtService.findValidDetailsByToken(tokenPair.accessToken())
      .orElseThrow(() -> new IllegalStateException("user not found by token"));

    Assertions.assertTrue(
      jwtService.findValidDetailsByToken(expiredToken).isEmpty(),
      "expired token was accepted"
    );
    Assertions.assertEquals(
      primaryUser.username(),
      details.getUsername(),
      "wrong user has been associated with this token"
    );
  }

  @SuppressWarnings("SameParameterValue")
  private String createExpiredToken(User user) {
    return Jwts.builder()
      .claims(Maps.newHashMap())
      .subject(user.username())
      .claim("authorities", user.getAuthorities())
      .issuedAt(new Date(System.currentTimeMillis()))
      .expiration(new Date(System.currentTimeMillis()))
      .signWith(key)
      .compact();
  }
}