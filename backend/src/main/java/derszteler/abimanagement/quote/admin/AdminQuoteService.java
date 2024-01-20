package derszteler.abimanagement.quote.admin;

import com.google.common.collect.Maps;
import derszteler.abimanagement.quote.Quote;
import derszteler.abimanagement.quote.UserQuote;
import derszteler.abimanagement.quote.review.QuoteReview;
import jakarta.annotation.Nullable;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Tuple;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class AdminQuoteService {
  private final EntityManager entityManager;

  @PreAuthorize("hasAuthority(" +
    "T(derszteler.abimanagement.user.User$Role).Admin" +
  ")")
  ListAdminQuotesResponse listQuotes(ListAdminQuotesRequest request) {
    var paginated = PageRequest.of(request.page(), request.limit());
    System.out.println("off: " + paginated.getOffset());
    var results = entityManager.createQuery(createListCriteria(request))
      .setMaxResults(request.limit())
      .setFirstResult(request.page() * request.limit())
      .getResultList();
    int total = calculateTotalAdminQuotes(request);
    return new ListAdminQuotesResponse(parseAdminQuoteTuples(results), total);
  }

  // TODO: Problem if page limiting separates two quotes of the same id
  private Collection<AdminQuote> parseAdminQuoteTuples(Collection<Tuple> tuples) {
    return tuples.stream()
      .collect(Collectors.toMap(
        tuple -> tuple.get(0, Integer.class),
        tuple -> new AdminQuote(
          tuple.get(0, Integer.class),
          tuple.get(1, String.class),
          tuple.get(2, String.class),
          tuple.get(3, Quote.Status.class),
          parseTupleToReview(tuple)
        ),
        (first, second) -> new AdminQuote(
          first.id(),
          first.content(),
          first.context(),
          first.status(),
          Stream.concat(first.reviews().stream(), second.reviews().stream())
            .toList()
        ),
        Maps::newLinkedHashMap
      ))
        .values();
  }

  private Collection<AdminQuote.Review> parseTupleToReview(@Nullable Tuple tuple) {
    //noinspection DataFlowIssue
    var review = tuple.get(4, QuoteReview.class);
    if (review == null) {
      return List.of();
    }
    return List.of(new AdminQuote.Review(
      review.user().displayName(),
      UserQuote.Status.parseFromReview(review)
    ));
  }

  private CriteriaQuery<Tuple> createListCriteria(ListAdminQuotesRequest request) {
    var builder = entityManager.getCriteriaBuilder();
    var criteria = builder.createTupleQuery();
    var root = criteria.from(Quote.class);
    var authors = root.joinCollection("authors", JoinType.LEFT);
    var reviews = root.joinCollection("reviews", JoinType.LEFT);
    var query = criteria
      .multiselect(
        root.get("id"),
        root.get("content"),
        root.get("context"),
        root.get("status"),
        reviews
      )
      .distinct(true)
      .orderBy(switch (request.orderBy()) {
        case CreatedAt -> {
          System.out.println("ordering by createdAt...");
          yield builder.asc(root.get("createdAt"));
        }
        case Username -> builder.asc(authors.get("lastName"));
      });
    if (request.hasUserFilter()) {
      query.where(builder.equal(authors.get("id"), request.userId()));
    }
    return query;
  }

  private int calculateTotalAdminQuotes(ListAdminQuotesRequest request) {
    var builder = entityManager.getCriteriaBuilder();
    var criteria = builder.createQuery();
    var root = criteria.from(Quote.class);
    var query = criteria
      .select(builder.count(root.get("id")));
    if (request.hasUserFilter()) {
      query.where(builder.equal(
        root.joinCollection("authors", JoinType.LEFT).get("id"),
        request.userId()
      ));
    }
    return ((Long) entityManager.createQuery(query).getSingleResult()).intValue();
  }
}