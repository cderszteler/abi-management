package derszteler.abimanagement.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import derszteler.abimanagement.Application;
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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest
@AutoConfigureWebMvc
@AutoConfigureMockMvc
@ContextConfiguration(classes = Application.class)
@TestPropertySource(locations = "classpath:application-testing.properties")
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Slf4j
public final class AuthenticationRestEndpointTest {
  private final UserRepository userRepository;
  private final ObjectMapper mapper;
  private final MockMvc mvc;

  private static final String password = "D&Uy=(P@BaApA&fL";
  private static final User user = User.builder()
    .username("christoph.derszteler")
    .password(new BCryptPasswordEncoder().encode(password))
    .build();

  @BeforeAll
  void createUser() {
    userRepository.save(user);
  }

  private static final String authenticationPath = "/api/v1/auth/authenticate";

  @Order(1)
  @Test
  void testInvalidAuthenticationRequests() throws Exception {
    mvc.perform(post(authenticationPath)
      .contentType("application/json")
    ).andExpect(MockMvcResultMatchers.status().isBadRequest());
    mvc.perform(post(authenticationPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new AuthenticationRequest("", "weakPW")))
    ).andExpect(MockMvcResultMatchers.status().isBadRequest());
  }

  @Order(2)
  @Test
  void testAuthentication() throws Exception {
    mvc.perform(post(authenticationPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new AuthenticationRequest(
        user.getUsername(),
        password.substring(1)
      )))
    ).andExpect(MockMvcResultMatchers.status().isForbidden());

    var response = mvc.perform(post(authenticationPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new AuthenticationRequest(
        user.getUsername(),
        password
      )))
    ).andReturn().getResponse();
    Assertions.assertEquals(
      200,
      response.getStatus(),
      "authentication was not successful"
    );

    var tokenPair = mapper.readValue(response.getContentAsString(), TokenPair.class);
    Assertions.assertNotNull(tokenPair, "received no response");
    Assertions.assertNotNull(tokenPair.accessToken(), "received no access token");
    Assertions.assertNotNull(tokenPair.refreshToken(), "received no refresh token");
  }
}