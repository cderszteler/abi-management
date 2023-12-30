package derszteler.abimanagement.comment;

import derszteler.abimanagement.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Service
public final class CommentService {
  private final CommentRepository repository;

  public ListCommentsResponse list(User user, Filter filter, int page, int limit) {
    var paginated = PageRequest.of(page, limit);

    var comments = switch (filter) {
      case Pending -> repository.findPendingComments(user, paginated);
      case Processed -> repository.findProcessedComments(user, paginated);
    };
    var total = switch (filter) {
      case Pending -> repository.countPendingComments(user);
      case Processed -> repository.countProcessedComments(user);
    };

    return new ListCommentsResponse(comments, total);
  }

  public void review(User user, int id, ReviewCommentRequest request) {
    var comment = repository.findById(id)
      .filter(existing -> existing.user().equals(user))
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    if (comment.hasExpired()) {
      throw new ResponseStatusException(HttpStatus.GONE, "expired");
    }

    comment.status(request.status());
    repository.save(comment);
  }

  public enum Filter {
    Pending,
    Processed
  }
}