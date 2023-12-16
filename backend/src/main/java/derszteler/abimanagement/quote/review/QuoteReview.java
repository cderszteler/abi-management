package derszteler.abimanagement.quote.review;

import com.fasterxml.jackson.annotation.JsonProperty;
import derszteler.abimanagement.quote.Quote;
import derszteler.abimanagement.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.id.IdentityGenerator;

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
  @Schema(description = "The unique id of a quote", example = "1")
  @JsonProperty
  @GenericGenerator(name = "increment", type = IdentityGenerator.class)
  @GeneratedValue(generator = "increment")
  @Id
  private Integer id;

  @Enumerated(EnumType.STRING)
  @Column
  private Status status;

  @ManyToOne
  @JoinColumn(nullable = false, name = "user_id")
  private User user;

  @ManyToOne
  @JoinColumn(nullable = false, name = "quote_id")
  private Quote quote;

  public enum Status {
    Pending,
    Accepted,
    Rejected
  }
}