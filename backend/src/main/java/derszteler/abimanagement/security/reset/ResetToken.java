package derszteler.abimanagement.security.reset;

import com.fasterxml.jackson.annotation.JsonIgnoreType;
import derszteler.abimanagement.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@SuppressWarnings("JpaDataSourceORMInspection")
@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreType
@Builder
@Data
@Table(
  name = "reset_tokens",
  uniqueConstraints = @UniqueConstraint(columnNames = {"token", "user"})
)
@Entity
public class ResetToken {
  @Id
  private UUID token;

  @OnDelete(action = OnDeleteAction.CASCADE)
  @OneToOne(optional = false)
  private User user;

  @Column(nullable = false)
  private LocalDateTime expiresAt;

  static final Duration expirationDuration = Duration.ofDays(1);

  public boolean isExpired() {
    return expiresAt.isBefore(LocalDateTime.now());
  }
}