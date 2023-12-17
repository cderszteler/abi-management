package derszteler.abimanagement.quote.review;

import derszteler.abimanagement.quote.Quote;
import derszteler.abimanagement.quote.QuoteRepository;
import derszteler.abimanagement.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Service
public final class QuoteReviewService {
  private final QuoteReviewRepository repository;
  private final QuoteRepository quoteRepository;

  public void review(User user, ReviewQuoteRequest request) {
    var quote = quoteRepository.findById(request.quoteId())
      .filter(existing -> existing.authors().contains(user))
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    if (quote.status() == Quote.Status.NotAllowed) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "quote is not allowed");
    }

    var review = repository.findByQuoteAndUser(request.quoteId(), user)
      .orElseGet(() -> QuoteReview.builder()
        .quote(quote)
        .user(user)
        .build()
      );
    review.status(request.status());
    repository.save(review);
  }
}