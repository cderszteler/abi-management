package derszteler.abimanagement.quote.review;

import derszteler.abimanagement.ErrorSchema;
import derszteler.abimanagement.user.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Tag(name = "Quotes")
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1/quote/{id}/review")
@RestController
public final class QuoteReviewRestEndpoint {
  private final QuoteReviewService service;

  @Operation(
    summary = "Review a quote",
    description = """
      This endpoint is used to review a user's quote. Reviews can be done on
      quotes that have not the status 'NotAllowed'.
      """,
    parameters = @Parameter(
      description = "The id of the quote to be reviewed.",
      example = "1",
      required = true,
      name = "id"
    ),
    requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
      content = @Content(schema = @Schema(implementation = ReviewQuoteRequest.class)),
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
    @RequestBody ReviewQuoteRequest request,
    @PathVariable int id
  ) {
    if (id <= 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid id");
    } else if (!request.valid()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid request body");
    }

    service.review(user, id, request);
    return ResponseEntity.ok().build();
  }
}