package derszteler.abimanagement.user;

import derszteler.abimanagement.user.dashboard.DisplayUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Collection;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer>, UserDetailsService {
  @Query("""
    select new derszteler.abimanagement.user.dashboard.DisplayUser(
      user.id,
      user.firstName,
      user.lastName
    )
    from User user
    order by user.lastName
    """
  )
  Collection<DisplayUser> listDisplayUsers();

  @Query("""
    select user
    from User user
    where lower(user.username) = lower(:username)
    """
  )
  Optional<User> findByUsername(String username);
  boolean existsByUsernameIgnoreCase(String username);

  @Override
  default UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return findByUsername(username)
      .orElseThrow(() -> new UsernameNotFoundException(
        "could not find user with username %s".formatted(username)
      ));
  }
}