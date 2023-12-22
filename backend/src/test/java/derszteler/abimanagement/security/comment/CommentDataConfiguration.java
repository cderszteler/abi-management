package derszteler.abimanagement.security.comment;

import derszteler.abimanagement.comment.Comment;
import derszteler.abimanagement.comment.CommentRepository;
import derszteler.abimanagement.user.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.assertj.core.util.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
public final class CommentDataConfiguration {
  private final CommentRepository repository;
  private final User primaryUser;

  @EventListener(ApplicationReadyEvent.class)
  void createMockData() {
    var reviews = Lists.newArrayList(
      Comment.builder()
        .content("Normal pending comment")
        .status(Comment.Status.Pending)
        .user(primaryUser)
        .build(),
      Comment.builder()
      .status(Comment.Status.Accepted)
      .content("I like you <3")
      .user(primaryUser)
      .build(),
    Comment.builder()
      .content("I don't like your muffins!")
      .status(Comment.Status.Rejected)
      .user(primaryUser)
      .build()
    );

    repository.saveAll(reviews);
  }
}