package derszteler.abimanagement.quote.review;

import derszteler.abimanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface QuoteReviewRepository extends JpaRepository<QuoteReview, Integer> {
  @Query("""
    select review
    from QuoteReview review
    where review.quote.id = :quoteId and review.user = :user
    """
  )
  Optional<QuoteReview> findByQuoteAndUser(int quoteId, User user);
}