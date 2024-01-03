package derszteler.abimanagement.security.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.security.AuthenticationConfiguration;
import derszteler.abimanagement.user.CreateUserRequest;
import derszteler.abimanagement.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
@Import({AuthenticationConfiguration.class})
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Slf4j
public final class UserRestEndpointTest {
  private final ObjectMapper mapper;
  @Qualifier("default")
  private final User defaultUser;
  private final MockMvc mvc;

  private static final String createPath = "/api/v1/user";

  @Order(1)
  @Test
  void testCreateRequest() throws Exception {
    mvc.perform(post(createPath)
        .contentType("application/json")
        .content(mapper.writeValueAsString(new CreateUserRequest("admin", null, "admin")))
      )
      .andExpect(MockMvcResultMatchers.status().isBadRequest());

    mvc.perform(post(createPath)
        .contentType("application/json")
        .content(mapper.writeValueAsString(new CreateUserRequest(
          "First", "Last", "first.last"
        )))
        .with(SecurityMockMvcRequestPostProcessors.user(defaultUser))
      )
      .andExpect(MockMvcResultMatchers.status().isForbidden());

    mvc.perform(post(createPath)
        .contentType("application/json")
        .content(mapper.writeValueAsString(new CreateUserRequest(
          "Christoph", "Derszteler", "christoph.derszteler"
        )))
      )
      .andExpect(MockMvcResultMatchers.status().isConflict());

    var response = mvc.perform(post(createPath)
        .contentType("application/json")
        .content(mapper.writeValueAsString(new CreateUserRequest(
          "Max", "Mustermann", "max.mustermann"
        )))
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn().getResponse();

    var node = (ObjectNode) mapper.readTree(response.getContentAsString());
    Assertions.assertEquals(
      "Max Mustermann",
      node.get("displayName").textValue(),
      "expected different displayName of created user"
    );
  }
}