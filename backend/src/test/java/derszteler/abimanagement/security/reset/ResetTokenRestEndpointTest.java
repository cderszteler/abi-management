package derszteler.abimanagement.security.reset;

import com.fasterxml.jackson.databind.ObjectMapper;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.security.AuthenticationConfiguration;
import derszteler.abimanagement.user.User;
import derszteler.abimanagement.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
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
@TestPropertySource(locations = "classpath:application-testing.properties")
@Import(AuthenticationConfiguration.class)
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Slf4j
public final class ResetTokenRestEndpointTest {
  private final ResetTokenRepository repository;
  private final UserRepository userRepository;
  private final ObjectMapper mapper;
  private final User primaryUser;
  private final MockMvc mockMvc;

  private static final UUID resetToken = UUID.randomUUID();

  @BeforeAll
  void setupToken() {
    repository.save(ResetToken.builder()
      .expiresAt(LocalDateTime.now().plus(ResetToken.expirationDuration))
      .token(resetToken)
      .user(primaryUser)
      .build()
    );
  }

  private static final String newPassword = AuthenticationConfiguration.primaryUserPassword;
  private static final String resetPath = "/api/v1/auth/reset";

  @Order(1)
  @Test
  void testInvalidToken() throws Exception {
    mockMvc.perform(post(resetPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new ResetRequest("invalid", newPassword)))
      .with(SecurityMockMvcRequestPostProcessors.anonymous())
    ).andExpect(MockMvcResultMatchers.status().isBadRequest());

    mockMvc.perform(post(resetPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new ResetRequest(
        UUID.randomUUID().toString(),
        newPassword
      )))
      .with(SecurityMockMvcRequestPostProcessors.anonymous())
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
      .with(SecurityMockMvcRequestPostProcessors.anonymous())
    ).andExpect(MockMvcResultMatchers.status().isOk());

    var user = userRepository.findByUsername(primaryUser.username())
      .orElseThrow(() -> new IllegalStateException("user not found"));

    Assertions.assertFalse(
      repository.existsById(resetToken),
      "reset token still exists"
    );
    Assertions.assertFalse(user.disabled(), "user is still disabled");
  }
}