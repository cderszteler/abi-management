package derszteler.abimanagement.quote;

import derszteler.abimanagement.quote.CreateQuoteRequest.QuoteAuthor;
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

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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
    var authors = findQuoteAuthors(request.authors());
    if (authors.isEmpty()) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "authors not found");
    }

    var quote = repository.save(Quote.builder()
      .content(request.content())
      .context(request.context())
      .status(request.staus())
      .authors(authors.values())
      .build()
    );
    reviewRepository.saveAll(authors.entrySet().stream()
      .map(entry -> QuoteReview.emptyReviewForQuote(entry.getValue(), quote)
        .expiringAt(entry.getKey().expiringAt())
      )
      .toList()
    );

    return quote;
  }

  private Map<QuoteAuthor, User> findQuoteAuthors(
    Set<QuoteAuthor> authors
  ) {
    var mapped = authors.stream()
      .collect(Collectors.toMap(
        QuoteAuthor::id,
        author -> author
      ));
    var users = userRepository.findAllById(mapped.keySet());
    return users.stream()
      .collect(Collectors.toMap(
        user -> mapped.get(user.id()),
        user -> user
      ));
  }

  public enum Filter {
    Pending,
    Processed,
    NotAllowed
  }
}