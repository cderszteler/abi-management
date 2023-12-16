package derszteler.abimanagement.quote.review;

import derszteler.abimanagement.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1/quote/review")
@RestController
public final class QuoteReviewRestEndpoint {
  private final QuoteReviewService service;

  // TODO: Add documentation

  @PostMapping(produces = "application/json")
  public ResponseEntity<Void> review(
    @AuthenticationPrincipal User user,
    @RequestBody ReviewQuotesRequest request
  ) {
    if (!request.valid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid request body");
    }

    service.review(user, request);
    return ResponseEntity.ok().build();
  }
}