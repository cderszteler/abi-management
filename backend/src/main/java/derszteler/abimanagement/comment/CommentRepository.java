package derszteler.abimanagement.comment;

import derszteler.abimanagement.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
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