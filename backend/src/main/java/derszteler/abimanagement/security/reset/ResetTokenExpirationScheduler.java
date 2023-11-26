package derszteler.abimanagement.security.reset;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Component
public final class ResetTokenExpirationScheduler {
  private final ResetTokenRepository repository;

  @Scheduled(timeUnit = TimeUnit.DAYS, fixedRate = 1)
  private void removeExpiredResetTokens() {
    repository.deleteBeforeExpiresAt(LocalDateTime.now());
  }
}