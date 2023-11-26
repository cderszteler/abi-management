package derszteler.abimanagement.security;

import com.google.common.collect.Maps;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.user.User;
import derszteler.abimanagement.user.UserRepository;
import io.jsonwebtoken.Jwts;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;

import javax.crypto.SecretKey;
import java.util.Date;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest
@ContextConfiguration(classes = Application.class)
@TestPropertySource(locations = "classpath:application-testing.properties")
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Slf4j
public final class JwtServiceTest {
  private final AuthenticationService authenticationService;
  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final SecretKey key;

  private TokenPair tokenPair;

  private static final String password = "D&Uy=(P@BaApA&fL";
  private static final User user = User.builder()
    .username("christoph.derszteler")
    .password(new BCryptPasswordEncoder().encode(password))
    .build();

  @BeforeAll
  void createUser() {
    userRepository.save(user);

    tokenPair = authenticationService.createTokenPair(user);
  }

  @Order(1)
  @Test
  void testFindDetailsByToken() {
    var expiredToken = createExpiredToken(user);
    var details = jwtService.findValidDetailsByToken(tokenPair.accessToken())
      .orElseThrow(() -> new IllegalStateException("user not found by token"));

    Assertions.assertTrue(
      jwtService.findValidDetailsByToken(expiredToken).isEmpty(),
      "expired token was accepted"
    );
    Assertions.assertEquals(
      user.username(),
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