package derszteler.abimanagement.quote;

import derszteler.abimanagement.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Service
public final class QuoteService {
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

  public enum Filter {
    Pending,
    Processed,
    NotAllowed
  }
}