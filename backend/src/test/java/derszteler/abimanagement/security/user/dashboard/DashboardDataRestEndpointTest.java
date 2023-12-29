package derszteler.abimanagement.security.user.dashboard;

import com.fasterxml.jackson.databind.ObjectMapper;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.security.AuthenticationConfiguration;
import derszteler.abimanagement.user.User;
import derszteler.abimanagement.user.dashboard.DashboardData;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

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
public final class DashboardDataRestEndpointTest {
  private final ObjectMapper mapper;
  private final User primaryUser;
  private final MockMvc mvc;

  private static final String dashboardDataPath = "/api/v1/user/dashboard";

  @Order(1)
  @Test
  void test() throws Exception {
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
    // TODO: Implement test for 'expiringAt' field
  }
}