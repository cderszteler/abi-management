package derszteler.abimanagement.security.user.dashboard;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.google.common.collect.Lists;
import com.google.common.collect.Ordering;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.security.AuthenticationConfiguration;
import derszteler.abimanagement.security.quote.QuoteDataConfiguration;
import derszteler.abimanagement.user.User;
import derszteler.abimanagement.user.dashboard.DashboardData;
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

import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@SpringBootTest
@AutoConfigureWebMvc
@AutoConfigureMockMvc
@ContextConfiguration(classes = {Application.class, QuoteDataConfiguration.class})
@TestPropertySource(locations = "classpath:application-testing.properties")
@Import(AuthenticationConfiguration.class)
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Slf4j
public final class DashboardRestEndpointTest {
  private final ObjectMapper mapper;
  @Qualifier("default")
  private final User defaultUser;
  private final User primaryUser;
  private final MockMvc mvc;

  private static final String dashboardDataPath = "/api/v1/user/dashboard";

  @Order(1)
  @Test
  void testDashboardData() throws Exception {
    var response = mvc.perform(get(dashboardDataPath)
      .contentType("application/json")
    )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn().getResponse();
    var dashboardData = mapper.readValue(
      response.getContentAsString(),
      DashboardData.class
    );

    Assertions.assertEquals(primaryUser, dashboardData.user(), "users are not equal");
    Assertions.assertEquals(
      QuoteDataConfiguration.expiringAt,
      dashboardData.expiringAt(),
      "'expiringAt' was not not expected"
    );
  }

  private static final String displayUsersPath = "/api/v1/user/dashboard/admin/users";

  @Order(2)
  @Test
  void testDisplayUsers() throws Exception {
    mvc.perform(get(displayUsersPath)
        .contentType("application/json")
        .with(SecurityMockMvcRequestPostProcessors.user(defaultUser))
      )
      .andExpect(MockMvcResultMatchers.status().isForbidden());

    var response = mvc.perform(get(displayUsersPath)
        .contentType("application/json")
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn().getResponse();
    var displayUsers = (ArrayNode) mapper.readTree(response.getContentAsString());

    Assertions.assertTrue(displayUsers.size() >= 2, "missing display users");
    Assertions.assertTrue(Ordering.<String>natural().isOrdered(
      StreamSupport.stream(displayUsers.spliterator(), false)
        .map(node -> extractLastName(node.get("displayName").textValue()))
        .collect(Collectors.toCollection(Lists::newLinkedList))
    ), "display users are not ordered");
  }

  // This could not be done in a real-world scenario, but is acceptable in the
  // test environment
  private String extractLastName(String displayName) {
    return displayName.split(" ")[1];
  }
}