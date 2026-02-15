package e_waste.infosys.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import e_waste.infosys.service.AuthService;
import e_waste.infosys.service.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        String result = authService.register(request.email(), request.password());

        if (result.startsWith("OTP sent")) {
            return ResponseEntity.ok(Map.of("message", result));
        }
        if (result.equals("Email already registered")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", result));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, String>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        String result = authService.verifyOtpAndSaveUser(
                request.email(),
                request.password(),
                request.otp());

        if (result.startsWith("User verified")) {
            return ResponseEntity.ok(Map.of("message", result));
        }
        if (result.equals("Email already registered")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", result));
        }
        if (result.equals("Invalid OTP")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", result));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        String result = authService.login(request.email(), request.password());

        if (result.equals("Login successful")) {
            String token = jwtService.generateToken(request.email().trim());
            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(false) 
                    .path("/")
                    .maxAge(jwtService.getExpirationSeconds())
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(Map.of("message", result));
        }

        if (result.equals("Invalid credentials")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", result));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Logged out"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody ChangePasswordRequest request) {
        String result = authService.changePassword(
                request.email(),
                request.currentPassword(),
                request.newPassword());

        if (result.startsWith("Password updated")) {
            return ResponseEntity.ok(Map.of("message", result));
        }
        if (result.equals("Current password is incorrect")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", result));
        }
        if (result.equals("User not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", result));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String result = authService.forgotPassword(request.email());

        if (result.startsWith("OTP sent")) {
            return ResponseEntity.ok(Map.of("message", result));
        }
        if (result.equals("User not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", result));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        String result = authService.resetPassword(request.email(), request.otp(), request.newPassword());

        if (result.startsWith("Password reset")) {
            return ResponseEntity.ok(Map.of("message", result));
        }
        if (result.equals("Invalid OTP")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", result));
        }
        if (result.equals("User not found")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", result));
        }
        return ResponseEntity.badRequest().body(Map.of("error", result));
    }

    public record RegisterRequest(String email, String password) {}

    public record VerifyOtpRequest(String email, String password, String otp) {}

    public record LoginRequest(String email, String password) {}

    public record ChangePasswordRequest(String email, String currentPassword, String newPassword) {}

    public record ForgotPasswordRequest(String email) {}

    public record ResetPasswordRequest(String email, String otp, String newPassword) {}
}
