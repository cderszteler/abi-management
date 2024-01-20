package derszteler.abimanagement.quote.admin;

import com.google.common.collect.Lists;
import derszteler.abimanagement.quote.Quote;
import derszteler.abimanagement.quote.UserQuote;
import derszteler.abimanagement.quote.review.QuoteReview;
import derszteler.abimanagement.quote.review.QuoteReviewRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class AdminQuoteService {
  private final QuoteReviewRepository reviewRepository;
  private final EntityManager entityManager;

  @PreAuthorize("hasAnyAuthority(" +
    "T(derszteler.abimanagement.user.User$Role).Moderator, " +
    "T(derszteler.abimanagement.user.User$Role).Admin" +
  ")")
  ListAdminQuotesResponse listQuotes(ListAdminQuotesRequest request) {
    var quotes = entityManager.createQuery(createListCriteria(request))
      .setMaxResults(request.limit())
      .setFirstResult(request.page() * request.limit())
      .getResultList();
    var reviews = reviewRepository.findByQuotes(quotes);
    int total = calculateTotalAdminQuotes(request);
    return new ListAdminQuotesResponse(
      mapReviewsToAdminQuotes(quotes, reviews),
      total
    );
  }

  private Collection<AdminQuote> mapReviewsToAdminQuotes(
    Collection<Quote> quotes,
    Collection<QuoteReview> reviews
  ) {
    var mapped = reviews.stream()
      .collect(Collectors.toMap(
        review -> review.quote().id(),
        List::of,
        (first, second) -> {
          var combined = Lists.newArrayList(first);
          combined.addAll(second);
          return combined;
        }
      ));
    return quotes.stream()
      .map(quote -> new AdminQuote(
        quote.id(),
        quote.content(),
        quote.context(),
        quote.status(),
        mapped.getOrDefault(quote.id(), List.of()).stream()
          .map(review -> new AdminQuote.Review(
            review.user().displayName(),
            UserQuote.Status.parseFromReview(review)
          ))
          .toList()
      ))
      .collect(Collectors.toCollection(Lists::newLinkedList));
  }

  private CriteriaQuery<Quote> createListCriteria(ListAdminQuotesRequest request) {
    var builder = entityManager.getCriteriaBuilder();
    var criteria = builder.createQuery(Quote.class);
    var root = criteria.from(Quote.class);
    var authors = root.joinCollection("authors", JoinType.LEFT);
    var query = criteria
      .select(root)
      .distinct(true)
      .orderBy(switch (request.orderBy()) {
        case CreatedAt -> builder.asc(root.get("createdAt"));
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