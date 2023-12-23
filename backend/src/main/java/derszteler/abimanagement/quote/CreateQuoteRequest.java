package derszteler.abimanagement.quote;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;

import java.util.Set;

public record CreateQuoteRequest(
  @Schema(description = "The content of the quote", example = "I am a cyborg.")
  String content,
  @Schema(
    description = "The context of the quote",
    example = "said while running",
    nullable = true
  )
  @Nullable
  String context,
  @Schema(description = "The (User) ids of the quote's authors", example = "[1]")
  Set<Integer> authorIds,
  @Schema(
    description = "The status **of the quote**. " +
      "This is not the status of a review of this quote.",
    example = "NotAllowed",
    nullable = true
  )
  @Nullable
  Quote.Status staus
) {
  // Suppress warning is wrong in this case
  @SuppressWarnings("ConstantValue")
  boolean valid() {
    return (content != null && !content.isBlank())
      && (authorIds != null && !authorIds.isEmpty())
      && (context == null || !content.isBlank());
  }
}