package derszteler.abimanagement.quote.admin;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@Tag(name = "Quotes")
@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@RequestMapping("/api/v1/admin")
@RestController
public final class AdminQuoteRestEndpoint {
  private final AdminQuoteService service;

  // TODO: Add documentation
  @GetMapping(value = "/quotes", produces = "application/json")
  ResponseEntity<ListAdminQuotesResponse> listAdminQuotes(
    @RequestParam(required = false) Integer userId,
    @RequestParam(defaultValue = "CreatedAt") ListAdminQuotesRequest.OrderBy orderBy,
    @RequestParam(defaultValue = "0") Integer page,
    @RequestParam(defaultValue = "20") Integer limit
  ) {
    if (page < 0 || limit < 1 || limit > 50) {
      throw new ResponseStatusException(
        HttpStatus.BAD_REQUEST,
        "invalid pagination parameters"
      );
    }

    return ResponseEntity.ok(service.listQuotes(
      new ListAdminQuotesRequest(userId, orderBy, page, limit)
    ));
  }
}