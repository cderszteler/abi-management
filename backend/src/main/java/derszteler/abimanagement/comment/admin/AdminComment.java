package derszteler.abimanagement.comment.admin;

import derszteler.abimanagement.comment.Comment;
import io.swagger.v3.oas.annotations.media.Schema;

record AdminComment(
  @Schema(description = "The id of the comment", example = "1")
  int id,
  @Schema(description = "The content of the comment", example = "I love you")
  String content,
  @Schema(
    description = "The status of the user's review for the comment.",
    example = "Pending",
    nullable = true
  )
  Comment.DeserializationStatus status,
  @Schema(
    description = "The display name of the comment's user",
    example = "Christoph Derszteler"
  )
  String userDisplayName
) {
  @Override
  public boolean equals(Object object) {
    if (object == this) {
      return true;
    }
    if (!(object instanceof AdminComment)) {
      return false;
    }
    var comment = (AdminComment) object;
    return id == comment.id;
  }
}