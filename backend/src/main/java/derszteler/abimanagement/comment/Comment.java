package derszteler.abimanagement.comment;

import com.fasterxml.jackson.annotation.JsonProperty;
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

import java.time.LocalDateTime;

@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Table(name = "comments")
@Entity
public class Comment {
  @Schema(description = "The unique id of a comment", example = "1")
  @JsonProperty
  @GeneratedValue
  @Id
  private Integer id;

  @Schema(description = "The content of the comment", example = "I love you")
  @JsonProperty
  @Column(nullable = false, columnDefinition = "text not null")
  private String content;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Status status;

  @Schema(
    description = "The timestamp reviewing the comment expires and this is not possible anymore",
    example = "2024-01-31T00:00:00.00000Z",
    nullable = true
  )
  @JsonProperty
  @Column
  @Nullable
  private LocalDateTime expiringAt;

  @ManyToOne
  @JoinColumn(nullable = false)
  private User user;

  @Builder.Default
  @CreationTimestamp
  @ColumnDefault("now()")
  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  // Only used for JSON deserialization
  @Schema(description = "The status of the comment", example = "Pending")
  @JsonProperty("status")
  public DeserializationStatus deserializationStatus() {
    if (status == Status.Pending && hasExpired()) {
      return DeserializationStatus.Expired;
    }
    return switch (status) {
      case Pending -> DeserializationStatus.Pending;
      case Accepted -> DeserializationStatus.Accepted;
      case Rejected -> DeserializationStatus.Rejected;
    };
  }

  @Schema(description = "Boolean if the comment's review has expired", example = "false")
  @JsonProperty("expired")
  public boolean hasExpired() {
    return expiringAt != null && expiringAt.isBefore(LocalDateTime.now());
  }

  public enum Status {
    Pending,
    Accepted,
    Rejected
  }

  public enum DeserializationStatus {
    Pending,
    Accepted,
    Rejected,
    Expired
  }
}