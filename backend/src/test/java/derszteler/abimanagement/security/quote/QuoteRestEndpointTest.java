package derszteler.abimanagement.security.quote;

import com.fasterxml.jackson.databind.ObjectMapper;
import derszteler.abimanagement.Application;
import derszteler.abimanagement.quote.CreateQuoteRequest;
import derszteler.abimanagement.quote.ListQuotesResponse;
import derszteler.abimanagement.quote.QuoteService;
import derszteler.abimanagement.security.AuthenticationConfiguration;
import derszteler.abimanagement.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.assertj.core.util.Lists;
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

import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
public final class QuoteRestEndpointTest {
  private final ObjectMapper mapper;
  @Qualifier("default")
  private final User defaultUser;
  private final MockMvc mvc;

  private static final String listPath = "/api/v1/quotes";

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
    var pendingResponse = mvc.perform(get(listPath)
      .contentType("application/json")
      .queryParam("filter", QuoteService.Filter.Pending.toString())
    )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn().getResponse();
    var emptyPageResponse = mvc.perform(get(listPath)
      .contentType("application/json")
      .queryParam("filter", QuoteService.Filter.Pending.toString())
      .queryParam("page", "1")
    )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn().getResponse();

    var pendingResult = mapper.readValue(
      pendingResponse.getContentAsString(),
      ListQuotesResponse.class
    );
    var emptyResult = mapper.readValue(
      emptyPageResponse.getContentAsString(),
      ListQuotesResponse.class
    );

    Assertions.assertEquals(2, pendingResult.total(), "total pending quotes do not match");
    Assertions.assertEquals(2, emptyResult.total(), "total pending quotes do not match");
    Assertions.assertEquals(2, pendingResult.quotes().size(), "pending quotes' size do not match");
    Assertions.assertEquals(0, emptyResult.quotes().size(), "empty page has quotes");
  }

  @Order(3)
  @Test
  void testProcessedListRequest() throws Exception {
    var response = mvc.perform(get(listPath)
        .contentType("application/json")
        .queryParam("filter", QuoteService.Filter.Processed.toString())
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn().getResponse();
    var result = mapper.readValue(
      response.getContentAsString(),
      ListQuotesResponse.class
    );
    Assertions.assertEquals(1, result.quotes().size(), "processed quotes' size do not match");

    var quote = Lists.newArrayList(result.quotes()).getFirst();
    Assertions.assertEquals(3, quote.id(), "expected different processed quote's id");
  }

  @Order(3)
  @Test
  void testNotAllowedListRequest() throws Exception {
    var response = mvc.perform(get(listPath)
        .contentType("application/json")
        .queryParam("filter", QuoteService.Filter.NotAllowed.toString())
      )
      .andExpect(MockMvcResultMatchers.status().isOk())
      .andReturn().getResponse();
    var result = mapper.readValue(
      response.getContentAsString(),
      ListQuotesResponse.class
    );
    Assertions.assertEquals(1, result.quotes().size(), "not-allowed quotes' size do not match");

    var quote = Lists.newArrayList(result.quotes()).getFirst();
    Assertions.assertEquals(4, quote.id(), "expected different not-allowed quote's id");
  }

  private static final String createPath = "/api/v1/quote";

  @Order(4)
  @Test
  void testCreateRequest() throws Exception {
    mvc.perform(post(createPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new CreateQuoteRequest(null, null, null, null)))
    )
    .andExpect(MockMvcResultMatchers.status().isBadRequest());

    mvc.perform(post(createPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new CreateQuoteRequest(
        "content", null, Set.of(3), null
      )))
      .with(SecurityMockMvcRequestPostProcessors.user(defaultUser))
    )
    .andExpect(MockMvcResultMatchers.status().isForbidden());

    mvc.perform(post(createPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new CreateQuoteRequest(
        "content", null, Set.of(100), null
      )))
    )
    .andExpect(MockMvcResultMatchers.status().isNotFound());

    mvc.perform(post(createPath)
      .contentType("application/json")
      .content(mapper.writeValueAsString(new CreateQuoteRequest(
        "Cool quote", "with context?", Set.of(1), null
      )))
    )
    .andExpect(MockMvcResultMatchers.status().isOk());
  }
}