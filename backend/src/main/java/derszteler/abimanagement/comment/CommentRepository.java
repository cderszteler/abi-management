package derszteler.abimanagement.comment;

import derszteler.abimanagement.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
  @Query("""
    select comment.expiringAt
    from Comment comment
    where comment.user = :user
      and comment.expiringAt is not null
      and comment.expiringAt > current_timestamp()
    order by comment.expiringAt
    limit 1
    """
  )
  Optional<LocalDateTime> findEarliestExpiringAtByUser(User user);

  // List queries:

  @Query("""
    select comment
    from Comment comment
    where comment.user = :user
      and comment.status = derszteler.abimanagement.comment.Comment$Status.Pending
    order by comment.createdAt
    """
  )
  List<Comment> findPendingComments(User user, Pageable pageable);

  @Query("""
    select count(*)
    from Comment comment
    where comment.user = :user
      and comment.status = derszteler.abimanagement.comment.Comment$Status.Pending
    """
  )
  int countPendingComments(User user);

  @Query("""
    select comment
    from Comment comment
    where comment.user = :user
      and comment.status != derszteler.abimanagement.comment.Comment$Status.Pending
    order by comment.createdAt
    """
  )
  List<Comment> findProcessedComments(User user, Pageable pageable);

  @Query("""
    select count(*)
    from Comment comment
    where comment.user = :user
      and comment.status != derszteler.abimanagement.comment.Comment$Status.Pending
    """
  )
  int countProcessedComments(User user);
}