package derszteler.abimanagement.security;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE, onConstructor_ = @Autowired)
@Controller
public final class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

  @RequestMapping("/error")
  ResponseEntity<Void> handleError(HttpServletRequest request) {
    var status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
    if (status == null) {
      return ResponseEntity.internalServerError().build();
    }

    var statusCode = Integer.parseInt(status.toString());
    var message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
    var detailed = ProblemDetail.forStatusAndDetail(
      HttpStatus.valueOf(statusCode),
      message.toString()
    );
    return ResponseEntity.of(detailed).build();
  }
}