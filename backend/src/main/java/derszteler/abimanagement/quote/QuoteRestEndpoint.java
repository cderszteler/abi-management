package derszteler.abimanagement.quote;

import derszteler.abimanagement.quote.QuoteService.Filter;
import derszteler.abimanagement.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1")
@RestController
public final class QuoteRestEndpoint {
  private final QuoteService service;

  // TODO: Add documentation

  @GetMapping(value = "/quotes", produces = "application/json")
  public ResponseEntity<ListQuotesResponse> list(
    @AuthenticationPrincipal User user,
    @RequestParam Filter filter,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int limit
  ) {
    if (page < 0 || limit < 1 || limit > 100) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid request body");
    }

    return ResponseEntity.ok(service.list(user, filter, page, limit));
  }
}