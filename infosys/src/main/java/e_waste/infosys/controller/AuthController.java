package e_waste.infosys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import e_waste.infosys.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {

        this.authService = authService;
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

    // Login
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        return authService.login(request.email(), request.password());
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
