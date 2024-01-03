package derszteler.abimanagement.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.user.User;
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
public final class AuthenticationRestEndpointTest {
  private final ObjectMapper mapper;
  private final User primaryUser;
  private final MockMvc mvc;

  private static final String authenticationPath = "/api/v1/auth/authenticate";

  @Order(1)
  @Test
  void testInvalidAuthenticationRequests() throws Exception {
    mvc.perform(post(authenticationPath)
      .contentType("application/json")
      .with(SecurityMockMvcRequestPostProcessors.anonymous())
    ).andExpect(MockMvcResultMatchers.status().isBadRequest());
    mvc.perform(post(authenticationPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new AuthenticationRequest("", "weakPW")))
      .with(SecurityMockMvcRequestPostProcessors.anonymous())
    ).andExpect(MockMvcResultMatchers.status().isBadRequest());
  }

  @Order(2)
  @Test
  void testAuthentication() throws Exception {
    mvc.perform(post(authenticationPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new AuthenticationRequest(
        primaryUser.getUsername(),
        AuthenticationConfiguration.primaryUserPassword.substring(1)
      )))
      .with(SecurityMockMvcRequestPostProcessors.anonymous())
    ).andExpect(MockMvcResultMatchers.status().isForbidden());

    var response = mvc.perform(post(authenticationPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new AuthenticationRequest(
        primaryUser.getUsername(),
        AuthenticationConfiguration.primaryUserPassword
      )))
      .with(SecurityMockMvcRequestPostProcessors.anonymous())
    ).andReturn().getResponse();
    Assertions.assertEquals(
      200,
      response.getStatus(),
      "authentication was not successful"
    );

    var authentication = mapper.readValue(response.getContentAsString(), AuthenticationResponse.class);
    Assertions.assertNotNull(authentication, "received no response");
    Assertions.assertNotNull(authentication.tokens().accessToken(), "received no access token");
    Assertions.assertNotNull(authentication.tokens().refreshToken(), "received no refresh token");
  }
}