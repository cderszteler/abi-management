package derszteler.abimanagement.quote;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Service
public final class QuoteService {
  private final QuoteRepository repository;

  // TODO: Implement (include pagination)
  public Collection<UserQuote> list(ListQuotesRequest request) {
    throw new UnsupportedOperationException();
  }
}