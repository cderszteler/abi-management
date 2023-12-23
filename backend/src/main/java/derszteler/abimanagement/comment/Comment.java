package derszteler.abimanagement.comment;

import com.fasterxml.jackson.annotation.JsonProperty;
import derszteler.abimanagement.user.User;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Table(name = "comments")
@Entity
public class Comment {
  @Schema(description = "The unique id of a comment", example = "1")
  @JsonProperty
  @GenericGenerator(name = "increment", type = IncrementGenerator.class)
  @GeneratedValue(generator = "increment")
  @Id
  private Integer id;

  @Schema(description = "The content of the comment", example = "I love you")
  @JsonProperty
  @Column(nullable = false)
  private String content;

  @Schema(description = "The status of the comment", example = "Pending")
  @JsonProperty
  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Status status;

  @ManyToOne
  @JoinColumn(nullable = false)
  private User user;

  @Builder.Default
  @CreationTimestamp
  @ColumnDefault("now()")
  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  public enum Status {
    Pending,
    Accepted,
    Rejected
  }
}