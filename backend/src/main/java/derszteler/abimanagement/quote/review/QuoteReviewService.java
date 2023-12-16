package derszteler.abimanagement.quote.review;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Service
public final class QuoteReviewService {
  private final QuoteReviewRepository repository;

  // TODO: Implement
  public void review(ReviewQuotesRequest request) {
    throw new UnsupportedOperationException();
  }
}