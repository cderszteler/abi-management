package derszteler.abimanagement.user.dashboard;

import derszteler.abimanagement.comment.CommentRepository;
import derszteler.abimanagement.quote.QuoteRepository;
import derszteler.abimanagement.user.User;
import derszteler.abimanagement.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class DashboardService {
  private final CommentRepository commentRepository;
  private final QuoteRepository quoteRepository;
  private final UserRepository userRepository;

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

  @PreAuthorize("hasAnyAuthority(" +
    "T(derszteler.abimanagement.user.User$Role).Moderator, " +
    "T(derszteler.abimanagement.user.User$Role).Admin" +
  ")")
  public Collection<DisplayUser> listDisplayUsers() {
    return userRepository.listDisplayUsers();
  }
}