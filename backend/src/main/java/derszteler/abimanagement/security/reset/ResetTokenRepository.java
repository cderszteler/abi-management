package derszteler.abimanagement.security.reset;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.UUID;

public interface ResetTokenRepository extends JpaRepository<ResetToken, UUID> {
  @Transactional
  @Modifying
  @Query("""
    delete
    from ResetToken token
    where token.expiresAt < :expiresAt
    """
  )
  void deleteBeforeExpiresAt(LocalDateTime expiresAt);
}