package derszteler.abimanagement.security.comment;

import com.fasterxml.jackson.databind.ObjectMapper;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.comment.CommentService;
import derszteler.abimanagement.comment.ListCommentsResponse;
import derszteler.abimanagement.security.AuthenticationConfiguration;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.assertj.core.util.Lists;
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
@Import({AuthenticationConfiguration.class, CommentDataConfiguration.class})
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Slf4j
public final class CommentRestEndpointTest {
  private final ObjectMapper mapper;
  private final MockMvc mvc;

  private static final String listPath = "/api/v1/comments";

  @Order(1)
  @Test
  void testInvalidListRequests() throws Exception {
    mvc.perform(get(listPath)
      .contentType("application/json")
    ).andExpect(MockMvcResultMatchers.status().isBadRequest());
    mvc.perform(get(listPath)
      .contentType("application/json")
      .param("filter", "InvalidFilter")
    ).andExpect(MockMvcResultMatchers.status().isBadRequest());
    mvc.perform(get(listPath)
      .contentType("application/json")
      .param("page", "-3")
    ).andExpect(MockMvcResultMatchers.status().isBadRequest());
  }

  @Order(2)
  @Test
  void testPendingListRequests() throws Exception {
    var response = mvc.perform(get(listPath)
      .contentType("application/json")
      .queryParam("filter", CommentService.Filter.Pending.toString())
    )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn().getResponse();
    var result = mapper.readValue(
      response.getContentAsString(),
      ListCommentsResponse.class
    );

    Assertions.assertEquals(1, result.comments().size(), "pending comments' size do not match");

    var comment = Lists.newArrayList(result.comments()).getFirst();
    Assertions.assertEquals(1, comment.id(), "expected different rejected comment's id");
  }

  @Order(3)
  @Test
  void testProcessedListRequests() throws Exception {
    var processedResponse = mvc.perform(get(listPath)
        .contentType("application/json")
        .queryParam("filter", CommentService.Filter.Processed.toString())
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn().getResponse();
    var emptyResponse = mvc.perform(get(listPath)
        .contentType("application/json")
        .queryParam("filter", CommentService.Filter.Processed.toString())
        .queryParam("page", "1")
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn().getResponse();

    var processedResult = mapper.readValue(
      processedResponse.getContentAsString(),
      ListCommentsResponse.class
    );
    var emptyResult = mapper.readValue(
      emptyResponse.getContentAsString(),
      ListCommentsResponse.class
    );

    Assertions.assertEquals(2, processedResult.total(), "total processed comments do not match");
    Assertions.assertEquals(2, emptyResult.total(), "total processed comments do not match");
    Assertions.assertEquals(2, processedResult.comments().size(), "processed comments' size do not match");
    Assertions.assertEquals(0, emptyResult.comments().size(), "empty page has comments");
  }

  // TODO: Test review
}