package derszteler.abimanagement;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

import java.util.Arrays;

@Configuration
public class ApplicationConfiguration {
  @Qualifier("development")
  @Bean
  public boolean setDevelopmentEnvironment(
    Environment environment
  ) {
    return Arrays.asList(environment.getActiveProfiles()).contains("dev");
  }
}