package derszteler.abimanagement.quote;

import derszteler.abimanagement.quote.review.QuoteReview;
import derszteler.abimanagement.quote.review.QuoteReviewRepository;
import derszteler.abimanagement.user.User;
import derszteler.abimanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class QuoteService {
  private final QuoteReviewRepository reviewRepository;
  private final UserRepository userRepository;
  private final QuoteRepository repository;

  public ListQuotesResponse list(User user, Filter filter, int page, int limit) {
    var paginated = PageRequest.of(page, limit);

    var quotes = switch (filter) {
      case Pending -> repository.findPendingQuotes(user, paginated);
      case Processed -> repository.findProcessedQuotes(user, paginated);
      case NotAllowed -> repository.findNotAllowedQuotes(user, paginated);
    };
    var total = switch (filter) {
      case Pending -> repository.countPendingQuotes(user);
      case Processed -> repository.countProcessedQuotes(user);
      case NotAllowed -> repository.countNotAllowedQuotes(user);
    };

    return new ListQuotesResponse(quotes, total);
  }

  @PreAuthorize("hasAnyAuthority(" +
    "T(derszteler.abimanagement.user.User$Role).Moderator, " +
    "T(derszteler.abimanagement.user.User$Role).Admin" +
  ")")
  public Quote create(CreateQuoteRequest request) {
    var authors = userRepository.findAllById(request.authorIds());
    if (authors.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "authors not found");
    }

    var quote = repository.save(Quote.builder()
      .content(request.content())
      .context(request.context())
      .status(request.staus())
      .authors(authors)
      .build()
    );
    reviewRepository.saveAll(authors.stream()
      .map(author -> QuoteReview.emptyReviewForQuote(author, quote))
      .toList()
    );

    return quote;
  }

  public enum Filter {
    Pending,
    Processed,
    NotAllowed
  }
}