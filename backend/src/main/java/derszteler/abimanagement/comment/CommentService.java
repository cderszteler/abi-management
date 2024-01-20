package derszteler.abimanagement.comment;

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
public class CommentService {
  private final UserRepository userRepository;
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

  @PreAuthorize("hasAnyAuthority(" +
    "T(derszteler.abimanagement.user.User$Role).Moderator, " +
    "T(derszteler.abimanagement.user.User$Role).Admin" +
  ")")
  public Comment create(CreateCommentRequest request) {
    var user = userRepository.findById(request.userId())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "authors not found"));

    return repository.save(Comment.builder()
      .content(request.content())
      .status(Comment.Status.Pending)
      .user(user)
      .build()
    );
  }

  public enum Filter {
    Pending,
    Processed
  }
}