package derszteler.abimanagement.quote;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.node.ObjectNode;
import derszteler.abimanagement.quote.review.QuoteReview;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Nullable;

import java.io.IOException;

import static derszteler.abimanagement.quote.UserQuote.Status.*;

@JsonDeserialize(using = UserQuote.UserQuoteDeserializer.class)
public record UserQuote(
  @JsonIgnore
  @Schema(hidden = true)
  Quote quote,
  @Nullable
  @JsonIgnore
  @Schema(hidden = true)
  QuoteReview review
) {
  @Schema(description = "The id of the quote", example = "1")
  @JsonProperty
  public int id() {
    return quote.id();
  }

  @Schema(description = "The content of the quote", example = "I am a cyborg.")
  @JsonProperty
  public String content() {
    return quote().content();
  }

  @Schema(
    description = "The context of the quote",
    example = "said while running",
    nullable = true
  )
  @JsonProperty
  public String context() {
    return quote().context();
  }

  @Schema(
    description = """
      The (user-specific) status of a quote. Possible values:
        - 'NotAllowed' if the status of the quote is 'NotAllowed'
        - 'Expired' if the quote's review has expired and the quote has not been reviewed yet
        - 'Pending' if no review from the user exists for this quote
        - 'Accepted' if the user accepted this quote
        - 'Rejected' if the user rejected this quote
    """,
    example = "Pending"
  )
  @JsonProperty
  Status status() {
    if (quote.status() == Quote.Status.NotAllowed) {
      return NotAllowed;
    }
    if (review == null) {
      return Pending;
    } else if (review.status() == QuoteReview.Status.Pending && review.hasExpired()) {
      return Expired;
    }
    return switch (review.status()) {
      case Accepted -> Accepted;
      case Pending -> Pending;
      case Rejected -> Rejected;
    };
  }

  @Schema(description = "Boolean if the quote's review has expired", example = "false")
  @JsonProperty
  boolean expired() {
    if (review == null) {
      return false;
    }
    return review.hasExpired();
  }

  enum Status {
    Accepted,
    Pending,
    Rejected,
    Expired,
    NotAllowed
  }

  static final class UserQuoteDeserializer extends StdDeserializer<UserQuote> {
    @SuppressWarnings("unused")
    public UserQuoteDeserializer() {
      this(null);
    }

    public UserQuoteDeserializer(Class<?> valueClass) {
      super(valueClass);
    }

    @Override
    public UserQuote deserialize(
      JsonParser parser,
      DeserializationContext context
    ) throws IOException {
      var node = (ObjectNode) parser.getCodec().readTree(parser);

      return new UserQuote(
        Quote.builder()
          .id(node.get("id").intValue())
          .content(node.get("content").textValue())
          .context(node.get("context").textValue())
          .build(),
        null
      );
    }
  }
}