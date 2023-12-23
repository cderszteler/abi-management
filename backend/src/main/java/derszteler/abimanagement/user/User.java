package derszteler.abimanagement.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Lists;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.id.IncrementGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

import static derszteler.abimanagement.user.User.Role.Default;

@Accessors(fluent = true)
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Table(name = "users")
@Entity
public final class User implements UserDetails {
  @Schema(description = "The unique id of a user", example = "1")
  @JsonProperty
  @GenericGenerator(name = "increment", type = IncrementGenerator.class)
  @GeneratedValue(generator = "increment")
  @Id
  private Integer id;

  @Schema(description = "The unique username of a user", example = "admin")
  @Column(nullable = false, unique = true)
  private String username;

  @JsonIgnore
  @Column(nullable = false)
  private String password;

  @JsonProperty
  @Column(nullable = false)
  private String displayName;

  @Schema(description = "Boolean if the user is disabled", example = "false")
  @ColumnDefault("false")
  @Column
  private boolean disabled;

  @Schema(description = "Roles the user owns", example = "[\"Default\", \"Admin\"]")
  @JsonProperty
  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "user_roles")
  @Enumerated(EnumType.STRING)
  @Builder.Default
  private Collection<Role> roles = Lists.newArrayList(Default);

  @Override
  public int hashCode() {
    return Objects.hash(id);
  }

  @Override
  public boolean equals(Object object) {
    if (object == this) {
      return true;
    }
    if (!(object instanceof User)) {
      return false;
    }
    //noinspection PatternVariableCanBeUsed
    var user = (User) object;
    return id.equals(user.id);
  }

  @JsonIgnore
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    if (roles == null || roles.isEmpty()) {
      return List.of();
    }
    return roles.stream()
      .map(role -> new SimpleGrantedAuthority(role.toString()))
      .toList();
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

  public enum Role {
    Default,
    Moderator,
    Admin
  }
}