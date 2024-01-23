package derszteler.abimanagement;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.convert.ApplicationConversionService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.format.FormatterRegistry;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@EnableMethodSecurity
@Configuration
public class ApplicationConfiguration implements WebMvcConfigurer {
  @Qualifier("development")
  @Bean
  public boolean setDevelopmentEnvironment(
    Environment environment
  ) {
    return Arrays.asList(environment.getActiveProfiles()).contains("dev");
  }

  @SuppressWarnings("NullableProblems")
  @Override
  public void addFormatters(FormatterRegistry registry) {
    ApplicationConversionService.configure(registry);
  }
}