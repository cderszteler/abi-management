package derszteler.abimanagement.user;

import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

@Primary
public interface UserRepository extends JpaRepository<User, Integer>, UserDetailsService {
  Optional<User> findByUsername(String username);

  @Override
  default UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return findByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException(
        "could not find user with username %s".formatted(username)
      ));
  }
}