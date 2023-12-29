package derszteler.abimanagement.user.dashboard;

import derszteler.abimanagement.comment.CommentRepository;
import derszteler.abimanagement.quote.QuoteRepository;
import derszteler.abimanagement.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

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

  // TODO: Implement
  private LocalDate earliestExpiringAt(User user) {
    return null;
  }
}