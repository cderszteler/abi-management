package derszteler.abimanagement.security.reset;

import derszteler.abimanagement.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Service
public final class ResetTokenService {
  private final ResetTokenRepository repository;
  private final UserRepository userRepository;

  public void resetWithToken(UUID token) {
    var resetToken = repository.findById(token)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    if (resetToken.isExpired()) {
      repository.delete(resetToken);
      throw new ResponseStatusException(HttpStatus.GONE);
    }

    userRepository.save(resetToken.user().disabled(false));
    repository.delete(resetToken);
  }
}