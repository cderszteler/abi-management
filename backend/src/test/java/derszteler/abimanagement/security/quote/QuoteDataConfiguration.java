package derszteler.abimanagement.security.quote;

import derszteler.abimanagement.quote.Quote;
import derszteler.abimanagement.quote.QuoteRepository;
import derszteler.abimanagement.quote.review.QuoteReview;
import derszteler.abimanagement.quote.review.QuoteReviewRepository;
import derszteler.abimanagement.user.User;
import derszteler.abimanagement.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.assertj.core.util.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Collections;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
public final class QuoteDataConfiguration {
  private final QuoteReviewRepository reviewRepository;
  private final UserRepository userRepository;
  private final QuoteRepository repository;
  private final User primaryUser;

  // Nanos need to be 0, because H2 doesn't store as many decimals as the runtime
  public static final LocalDateTime expiringAt = LocalDateTime.now()
    .plusHours(1)
    .withNano(0);

  @EventListener(ApplicationReadyEvent.class)
  void createMockData() {
    var secondUser = User.builder()
      .password(new BCryptPasswordEncoder().encode("G0oDfR!end"))
      .firstName("Good")
      .lastName("Friend")
      .username("good.friend")
      .build();

    var normalQuote = Quote.builder()
      .content("Normal pending quote")
      .authors(Collections.singleton(primaryUser))
      .build();
    var contextQuote = Quote.builder()
      .content("I'm expired... :(")
      .authors(Collections.singleton(primaryUser))
      .context("Very relevant context")
      .build();
    var doubleAuthorsQuote = Quote.builder()
      .content("Christoph Derszteler: \"You fool!\"\n Good Friend: \"That is not funny!\"")
      .authors(Lists.newArrayList(primaryUser, secondUser))
      .build();
    var notAllowedQuote = Quote.builder()
      .status(Quote.Status.NotAllowed)
      .authors(Collections.singleton(primaryUser))
      .content("I don't like cheese")
      .build();

    var reviews = Lists.newArrayList(
      QuoteReview.builder()
        .quote(contextQuote)
        .status(QuoteReview.Status.Pending)
        .user(primaryUser)
        .expiringAt(expiringAt)
        .build(),
      QuoteReview.builder()
        .quote(doubleAuthorsQuote)
        .status(QuoteReview.Status.Rejected)
        .user(primaryUser)
        .expiringAt(LocalDateTime.now().minusMinutes(10))
        .build(),
      QuoteReview.builder()
        .quote(doubleAuthorsQuote)
        .status(QuoteReview.Status.Accepted)
        .user(secondUser)
        .build()
    );

    userRepository.save(secondUser);
    repository.saveAll(Lists.newArrayList(
      normalQuote,
      contextQuote,
      doubleAuthorsQuote,
      notAllowedQuote
    ));
    reviewRepository.saveAll(reviews);
  }
}