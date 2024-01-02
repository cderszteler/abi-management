package derszteler.abimanagement.comment;

import io.swagger.v3.oas.annotations.media.Schema;

public record CreateCommentRequest(
  @Schema(description = "The content of the comment", example = "I love you")
  String content,
  @Schema(description = "The id of the comment's user user")
  Integer userId
) {
  boolean valid() {
    return (content != null && !content.isBlank())
      && userId != null;
  }
}