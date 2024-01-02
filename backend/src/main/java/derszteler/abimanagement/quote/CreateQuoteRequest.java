package derszteler.abimanagement.quote;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;

import java.time.LocalDateTime;
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
  @Schema(description = "The authors of the quote")
  Set<QuoteAuthor> authors,
  @Schema(
    description = "The status **of the quote**. " +
      "This is not the status of a review of this quote.",
    example = "NotAllowed",
    nullable = true
  )
  @Nullable
  Quote.Status staus
) {
  boolean valid() {
    return (content != null && !content.isBlank())
      && (authors != null && !authors.isEmpty())
      && (context == null || !context.isBlank());
  }

  public record QuoteAuthor(
    @Schema(description = "The (User) id of the quote's author", example = "1")
    Integer id,
    @Schema(
      description = "The timestamp the quote's review expires for this author",
      example = "2024-01-31T00:00:00.00000Z",
      nullable = true
    )
    @Nullable
    LocalDateTime expiringAt
  ) {}
}