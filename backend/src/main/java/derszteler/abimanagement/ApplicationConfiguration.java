package derszteler.abimanagement;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApplicationConfiguration {
  @Qualifier("development")
  @Bean
  public boolean setDevelopmentEnvironment(
    @Value("${spring.profiles.active}") String activeProfile
  ) {
    return activeProfile != null && activeProfile.equals("dev");
  }
}