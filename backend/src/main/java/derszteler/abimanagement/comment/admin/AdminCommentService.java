package derszteler.abimanagement.comment.admin;

import com.google.common.collect.Lists;
import derszteler.abimanagement.comment.Comment;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class AdminCommentService {
  private final EntityManager entityManager;

  @PreAuthorize("hasAnyAuthority(" +
    "T(derszteler.abimanagement.user.User$Role).Moderator, " +
    "T(derszteler.abimanagement.user.User$Role).Admin" +
  ")")
  ListAdminCommentsResponse listQuotes(ListAdminCommentsRequest request) {
    var comments = entityManager.createQuery(createListCriteria(request))
      .setMaxResults(request.limit())
      .setFirstResult(request.page() * request.limit())
      .getResultList();
    int total = calculateTotalAdminComments(request);
    return new ListAdminCommentsResponse(
      mapComments(comments),
      total
    );
  }

  private Collection<AdminComment> mapComments(Collection<Comment> comments) {
    return comments.stream()
      .map(comment -> new AdminComment(
        comment.id(),
        comment.content(),
        comment.deserializationStatus(),
        comment.user().displayName()
      ))
      .collect(Collectors.toCollection(Lists::newLinkedList));
  }

  private CriteriaQuery<Comment> createListCriteria(ListAdminCommentsRequest request) {
    var builder = entityManager.getCriteriaBuilder();
    var criteria = builder.createQuery(Comment.class);
    var root = criteria.from(Comment.class);
    var user = root.join("user");
    var query = criteria
      .select(root)
      .orderBy(switch (request.orderBy()) {
        case CreatedAt -> builder.asc(root.get("createdAt"));
        case Username -> builder.asc(user.get("lastName"));
      });
    if (request.hasUserFilter()) {
      query.where(builder.equal(user.get("id"), request.userId()));
    }
    return query;
  }

  private int calculateTotalAdminComments(ListAdminCommentsRequest request) {
    var builder = entityManager.getCriteriaBuilder();
    var criteria = builder.createQuery();
    var root = criteria.from(Comment.class);
    var query = criteria
      .select(builder.count(root.get("id")));
    if (request.hasUserFilter()) {
      query.where(builder.equal(
        root.join("user").get("id"),
        request.userId()
      ));
    }
    return ((Long) entityManager.createQuery(query).getSingleResult()).intValue();
  }
}