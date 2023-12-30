package derszteler.abimanagement.user.dashboard;

import derszteler.abimanagement.comment.CommentRepository;
import derszteler.abimanagement.quote.QuoteRepository;
import derszteler.abimanagement.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Service
public final class DashboardService {
  private final CommentRepository commentRepository;
  private final QuoteRepository quoteRepository;

  public DashboardData createDashboardData(User user) {
    return new DashboardData(
      earliestExpiringAt(user),
      user
    );
  }

  private LocalDateTime earliestExpiringAt(User user) {
    var quote = quoteRepository.findEarliestExpiringAtByUser(user);
    var comment = commentRepository.findEarliestExpiringAtByUser(user);
    if (quote.isPresent() && comment.isPresent()) {
      return quote.get().isBefore(comment.get())
        ? quote.get()
        : comment.get();
    }
    return quote
      .or(() -> comment)
      .orElse(null);
  }
}