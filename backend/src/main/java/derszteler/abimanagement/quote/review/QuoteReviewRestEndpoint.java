package derszteler.abimanagement.quote.review;

import derszteler.abimanagement.ErrorSchema;
import derszteler.abimanagement.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@Tag(name = "Quotes")
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1/quote/review")
@RestController
public final class QuoteReviewRestEndpoint {
  private final QuoteReviewService service;

  @Operation(
    summary = "Review quote",
    description = """
      This endpoint is used to review a user's quote. Reviews can be done on
      quotes that have not the status 'NotAllowed'.
      """,
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      content = @Content(schema = @Schema(implementation = ReviewQuotesRequest.class)),
      description = "The status (review) the user wants give a quote",
      required = true
    ),
    responses = {
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The request body is invalid.",
        responseCode = "400"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The quote has the status 'NotAllowed' and cannot be reviewed.",
        responseCode = "403"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema(implementation = ErrorSchema.class)),
        description = "The quote was not found or the user does not have access to it.",
        responseCode = "404"
      ),
      @ApiResponse(
        content = @Content(schema = @Schema()),
        description = "The quote's status has been updated",
        responseCode = "200"
      )
    }
  )
  @PostMapping(produces = "application/json")
  public ResponseEntity<Void> review(
    @AuthenticationPrincipal User user,
    @RequestBody ReviewQuotesRequest request
  ) {
    if (!request.valid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid request body");
    }

    service.review(user, request);
    return ResponseEntity.ok().build();
  }
}