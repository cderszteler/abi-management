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

  private static final String reviewPath = "/api/v1/quote/review";

  @Test
  void testReview() throws Exception {
    mvc.perform(post(reviewPath)
        .contentType("application/json")
        .content(mapper.writeValueAsString(new ReviewQuoteRequest(1, QuoteReview.Status.Pending)))
      )
      .andExpect(MockMvcResultMatchers.status().isBadRequest());
    mvc.perform(post(reviewPath)
        .contentType("application/json")
        .content(mapper.writeValueAsString(new ReviewQuoteRequest(4, QuoteReview.Status.Rejected)))
      )
      .andExpect(MockMvcResultMatchers.status().isForbidden());
    mvc.perform(post(reviewPath)
        .contentType("application/json")
        .content(mapper.writeValueAsString(new ReviewQuoteRequest(10, QuoteReview.Status.Rejected)))
      )
      .andExpect(MockMvcResultMatchers.status().isNotFound());

    mvc.perform(post(reviewPath)
        .contentType("application/json")
        .content(mapper.writeValueAsString(new ReviewQuoteRequest(1, QuoteReview.Status.Accepted)))
      )
      .andExpect(MockMvcResultMatchers.status().isOk());
    mvc.perform(post(reviewPath)
        .contentType("application/json")
        .content(mapper.writeValueAsString(new ReviewQuoteRequest(2, QuoteReview.Status.Rejected)))
      )
      .andExpect(MockMvcResultMatchers.status().isOk());
  }
}