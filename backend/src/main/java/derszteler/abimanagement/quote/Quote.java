package derszteler.abimanagement.quote;

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
import org.hibernate.id.IdentityGenerator;

import java.time.LocalDateTime;
import java.util.Collection;

@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Table(name = "quotes")
@Entity
public class Quote {
  @Schema(description = "The unique id of a quote", example = "1")
  @JsonProperty
  @GenericGenerator(name = "increment", type = IdentityGenerator.class)
  @GeneratedValue(generator = "increment")
  @Id
  private Integer id;

  @Schema(description = "The content of the quote", example = "I am a cyborg.")
  @JsonProperty
  @Column
  private String content;

  @Schema(
    description = "The context of the quote",
    example = "said while running",
    nullable = true
  )
  @JsonProperty
  @Column
  private String context;

  @Enumerated(EnumType.STRING)
  @Column(nullable = true)
  private Status status;

  @ManyToMany
  @JoinTable(
    name = "quote_authors",
    joinColumns = @JoinColumn(nullable = false, name = "quote_id"),
    inverseJoinColumns = @JoinColumn(nullable = false, name = "user_id"),
    uniqueConstraints = @UniqueConstraint(columnNames = {"quote_id", "user_id"})
  )
  private Collection<User> authors;

  @Builder.Default
  @CreationTimestamp
  @ColumnDefault("now()")
  @Column(nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  public enum Status {
    NotAllowed
  }
}