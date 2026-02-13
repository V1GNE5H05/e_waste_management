package e_waste.infosys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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

    // Step 1: Register (send OTP)
    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        return authService.register(request.email(), request.password());
    }

    // Step 2: Verify OTP
    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody VerifyOtpRequest request) {

        return authService.verifyOtpAndSaveUser(
                request.email(),
                request.password(),
                request.otp());
    }

    // Login - issues JWT cookie on success
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String result = authService.login(request.email(), request.password());

        if (result.equals("Login successful")) {
            String token = jwtService.generateToken(request.email().trim());
            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .secure(false) // set to true in production with HTTPS
                    .path("/")
                    .maxAge(jwtService.getExpirationSeconds())
                    .sameSite("Lax")
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(result);
        }

        return ResponseEntity.ok(result);
    }

    // Logout - clears JWT cookie
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false) // set to true in production with HTTPS
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out");
    }

    @PostMapping("/change-password")
    public String changePassword(@RequestBody ChangePasswordRequest request) {

        return authService.changePassword(
                request.email(),
                request.currentPassword(),
                request.newPassword());
    }

    public record RegisterRequest(String email, String password) {}

    public record VerifyOtpRequest(String email, String password, String otp) {}

    public record LoginRequest(String email, String password) {}

    public record ChangePasswordRequest(String email, String currentPassword, String newPassword) {}
}
