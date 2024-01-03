package derszteler.abimanagement.security;

import derszteler.abimanagement.user.User;
import derszteler.abimanagement.user.UserRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.MockMvcBuilderCustomizer;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@TestConfiguration
public class AuthenticationConfiguration {
  @Bean
  MockMvcBuilderCustomizer authenticationBuilderCustomizer(
    User primaryUser
  ) {
    return builder -> builder.defaultRequest(get("/")
      .with(SecurityMockMvcRequestPostProcessors.user(primaryUser))
    );
  }

  public static final String primaryUserPassword = "D&Uy=(P@BaApA&fL";

  @Bean
  User primaryUser(UserRepository userRepository) {
    return userRepository.save(User.builder()
      .password(new BCryptPasswordEncoder().encode(primaryUserPassword))
      .roles(List.of(User.Role.Admin))
      .firstName("Christoph")
      .lastName("Derszteler")
      .username("christoph.derszteler")
      .build()
    );
  }

  @Qualifier("default")
  @Bean
  User defaultUser(UserRepository userRepository) {
    return userRepository.save(User.builder()
      .password(new BCryptPasswordEncoder().encode("password"))
      .firstName("John")
      .lastName("Doe")
      .username("john.doe")
      .build()
    );
  }
}