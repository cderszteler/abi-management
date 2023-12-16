package derszteler.abimanagement.quote;

import derszteler.abimanagement.user.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuoteRepository extends JpaRepository<Quote, Integer> {
  @Query("""
    select new derszteler.abimanagement.quote.UserQuote(
      quote,
      review
    )
    from Quote quote
    join quote.authors as author
    left join QuoteReview review on review.quote = quote and review.user = :user
    where author = :user and review is null and quote.status is null
    """
  )
  List<UserQuote> findPendingQuotes(User user, Pageable pageable);

  @Query("""
    select count(*)
    from Quote quote
    join quote.authors as author
    left join QuoteReview review on review.quote = quote and review.user = :user
    where author = :user and review is null and quote.status is null
    """
  )
  int countPendingQuotes(User user);

  @Query("""
    select new derszteler.abimanagement.quote.UserQuote(
      quote,
      review
    )
    from Quote quote
    join quote.authors as author
    left join QuoteReview review on review.quote = quote and review.user = :user
    where author = :user and review is not null
    """
  )
  List<UserQuote> findProcessedQuotes(User user, Pageable pageable);

  @Query("""
    select count(*)
    from Quote quote
    join quote.authors as author
    left join QuoteReview review on review.quote = quote and review.user = :user
    where author = :user and review is not null
    """
  )
  int countProcessedQuotes(User user);


  @Query("""
    select new derszteler.abimanagement.quote.UserQuote(
      quote,
      review
    )
    from Quote quote
    join quote.authors as author
    left join QuoteReview review on review.quote = quote and review.user = :user
    where author = :user and quote.status is not null
    """
  )
  List<UserQuote> findNotAllowedQuotes(User user, Pageable pageable);

  @Query("""
    select count(*)
    from Quote quote
    join quote.authors as author
    where author = :user and quote.status is not null
    """
  )
  int countNotAllowedQuotes(User user);
}