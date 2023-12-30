package derszteler.abimanagement.quote.review;

import com.fasterxml.jackson.annotation.JsonProperty;
import derszteler.abimanagement.quote.Quote;
import derszteler.abimanagement.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.id.IncrementGenerator;

import java.time.LocalDateTime;

@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Table(
  name = "quote_reviews",
  uniqueConstraints = @UniqueConstraint(columnNames = {"quote_id", "user_id"})
)
@Entity
public class QuoteReview {
  public static QuoteReview emptyReviewForQuote(User user, Quote quote) {
    return QuoteReview.builder()
      .status(Status.Pending)
      .quote(quote)
      .user(user)
      .build();
  }

  @Schema(description = "The unique id of a quote", example = "1")
  @JsonProperty
  @GenericGenerator(name = "increment", type = IncrementGenerator.class)
  @GeneratedValue(generator = "increment")
  @Id
  private Integer id;

  @Enumerated(EnumType.STRING)
  @Column
  private Status status;

  @Schema(
    description = "The timestamp the review expires and thus cannot be changed anymore afterwards",
    example = "2024-01-31T00:00:00.00000Z",
    nullable = true
  )
  @JsonProperty
  @Column
  @Nullable
  private LocalDateTime expiringAt;

  @ManyToOne
  @JoinColumn(nullable = false, name = "quote_id")
  private Quote quote;

  @ManyToOne
  @JoinColumn(nullable = false, name = "user_id")
  private User user;

  @Builder.Default
  @CreationTimestamp
  @ColumnDefault("now()")
  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  public boolean hasExpired() {
    return expiringAt != null && expiringAt.isBefore(LocalDateTime.now());
  }

  public enum Status {
    Pending,
    Accepted,
    Rejected
  }
}