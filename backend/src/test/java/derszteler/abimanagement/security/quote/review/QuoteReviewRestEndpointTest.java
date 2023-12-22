package derszteler.abimanagement.security.quote.review;

import com.fasterxml.jackson.databind.ObjectMapper;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.quote.review.QuoteReview;
import derszteler.abimanagement.quote.review.ReviewQuoteRequest;
import derszteler.abimanagement.security.AuthenticationConfiguration;
import derszteler.abimanagement.security.quote.QuoteDataConfiguration;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
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
@Import({AuthenticationConfiguration.class, QuoteDataConfiguration.class})
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Slf4j
public final class QuoteReviewRestEndpointTest {
  private final ObjectMapper mapper;
  private final MockMvc mvc;

  private static final String reviewPath = "/api/v1/quote/%d/review";

  @Test
  void testReview() throws Exception {
    mvc.perform(post(reviewPath.formatted(1))
        .contentType("application/json")
        .content(mapper.writeValueAsString(new ReviewQuoteRequest(QuoteReview.Status.Pending)))
      )
      .andExpect(MockMvcResultMatchers.status().isBadRequest());
    mvc.perform(post(reviewPath.formatted(4))
        .contentType("application/json")
        .content(mapper.writeValueAsString(new ReviewQuoteRequest(QuoteReview.Status.Rejected)))
      )
      .andExpect(MockMvcResultMatchers.status().isForbidden());
    mvc.perform(post(reviewPath.formatted(10))
        .contentType("application/json")
        .content(mapper.writeValueAsString(new ReviewQuoteRequest(QuoteReview.Status.Rejected)))
      )
      .andExpect(MockMvcResultMatchers.status().isNotFound());

    mvc.perform(post(reviewPath.formatted(1))
        .contentType("application/json")
        .content(mapper.writeValueAsString(new ReviewQuoteRequest(QuoteReview.Status.Accepted)))
      )
      .andExpect(MockMvcResultMatchers.status().isOk());
    mvc.perform(post(reviewPath.formatted(2))
        .contentType("application/json")
        .content(mapper.writeValueAsString(new ReviewQuoteRequest(QuoteReview.Status.Rejected)))
      )
      .andExpect(MockMvcResultMatchers.status().isOk());
  }
}