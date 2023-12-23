package derszteler.abimanagement.security.reset;

import com.fasterxml.jackson.databind.ObjectMapper;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.user.User;
import derszteler.abimanagement.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest
@AutoConfigureWebMvc
@AutoConfigureMockMvc
@ContextConfiguration(classes = Application.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
@TestPropertySource(locations = "classpath:application-testing.properties")
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Slf4j
public final class ResetTokenRestEndpointTest {
  private final ResetTokenRepository repository;
  private final UserRepository userRepository;
  private final ObjectMapper mapper;
  private final MockMvc mockMvc;

  private static final UUID resetToken = UUID.randomUUID();
  private static final User user = User.builder()
    .password(new BCryptPasswordEncoder().encode("D&Uy=(P@BaApA&fL"))
    .displayName("Christoph Derszteler")
    .username("christoph.derszteler")
    .build();

  @BeforeAll
  void setupTokens() {
    var user = userRepository.save(ResetTokenRestEndpointTest.user);

    repository.save(ResetToken.builder()
      .expiresAt(LocalDateTime.now().plus(ResetToken.expirationDuration))
      .token(resetToken)
      .user(user)
      .build()
    );
  }

  private static final String resetPath = "/api/v1/auth/reset";
  private static final String newPassword = user.password();

  @Order(1)
  @Test
  void testInvalidToken() throws Exception {
    mockMvc.perform(post(resetPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new ResetRequest("invalid", newPassword)))
    ).andExpect(MockMvcResultMatchers.status().isBadRequest());

    mockMvc.perform(post(resetPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new ResetRequest(
        UUID.randomUUID().toString(),
        newPassword
      )))
    ).andExpect(MockMvcResultMatchers.status().isNotFound());
  }

  @Order(2)
  @Test
  void testValidToken() throws Exception {
    mockMvc.perform(post(resetPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new ResetRequest(
        resetToken.toString(),
        newPassword
      )))
    ).andExpect(MockMvcResultMatchers.status().isOk());

    var user = userRepository.findByUsername(ResetTokenRestEndpointTest.user.username())
      .orElseThrow(() -> new IllegalStateException("user not found"));

    Assertions.assertFalse(
      repository.existsById(resetToken),
      "reset token still exists"
    );
    Assertions.assertFalse(user.disabled(), "user is still disabled");
  }
}