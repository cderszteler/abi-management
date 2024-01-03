package derszteler.abimanagement.user;

import derszteler.abimanagement.security.reset.ResetToken;
import derszteler.abimanagement.security.reset.ResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Service
public class UserService {
  private final ResetTokenRepository resetTokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final UserRepository repository;

  @PreAuthorize("hasAuthority(" +
    "T(derszteler.abimanagement.user.User$Role).Admin" +
  ")")
  public User create(CreateUserRequest request) {
    if (repository.existsByUsernameIgnoreCase(request.username())) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "this username already exists");
    }

    var user = repository.save(User.builder()
      .password(passwordEncoder.encode(UUID.randomUUID().toString()))
      .firstName(request.firstName())
      .lastName(request.lastName())
      .username(request.username())
      .build()
    );

    resetTokenRepository.save(ResetToken.builder()
      .expiresAt(LocalDateTime.now().plusWeeks(1))
      .token(UUID.randomUUID())
      .user(user)
      .build()
    );

    return user;
  }
}