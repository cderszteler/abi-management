package derszteler.abimanagement.security.reset;

import derszteler.abimanagement.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Service
public final class ResetTokenService {
  private final ResetTokenRepository repository;
  private final PasswordEncoder passwordEncoder;
  private final UserRepository userRepository;

  public void resetWithToken(ResetRequest request) {
    var resetToken = repository.findById(request.tokenAsId())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

    if (resetToken.isExpired()) {
      repository.delete(resetToken);
      throw new ResponseStatusException(HttpStatus.GONE);
    }

    userRepository.save(resetToken.user()
      .password(passwordEncoder.encode(request.password()))
      .disabled(false)
    );
    repository.delete(resetToken);
  }
}