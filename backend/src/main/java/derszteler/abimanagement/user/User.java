package derszteler.abimanagement.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreType;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.id.IdentityGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreType
@Builder
@Data
@Table(name = "users")
@Entity
public final class User implements UserDetails {
  @Schema(description = "The unique id of a user", example = "1")
  @JsonProperty
  @GenericGenerator(name = "increment", type = IdentityGenerator.class)
  @GeneratedValue(generator = "increment")
  @Id
  private Integer id;

  @Schema(description = "The unique username of a user", example = "admin")
  @Column(nullable = false, unique = true)
  @JsonProperty
  private String username;

  @JsonIgnore
  @Column(nullable = false)
  private String password;

  @Schema(description = "Boolean if the user is disabled", example = "false")
  @JsonProperty
  @ColumnDefault("false")
  @Column
  private boolean disabled;

  @JsonIgnore
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of();
  }

  @JsonIgnore
  @Override
  public String getUsername() {
    return username;
  }

  @JsonIgnore
  @Override
  public String getPassword() {
    return password;
  }

  @JsonIgnore
  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @JsonIgnore
  @Override
  public boolean isAccountNonLocked() {
    return !disabled;
  }

  @JsonIgnore
  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @JsonIgnore
  @Override
  public boolean isEnabled() {
    return !disabled;
  }
}