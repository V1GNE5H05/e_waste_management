package e_waste.infosys.service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import e_waste.infosys.entity.User;
import e_waste.infosys.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$");
    private static final String PASSWORD_REQUIREMENTS =
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

    public AuthService(
            UserRepository userRepository,
            OtpService otpService,
            EmailService emailService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(String email, String password) {
        String normalizedEmail = normalizeEmail(email);
        String validationError = validateCredentials(normalizedEmail, password);
        if (validationError != null) {
            return validationError;
        }

        User existing = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (existing != null) {
            return "Email already registered";
        }

        String otp = otpService.generateOtp(normalizedEmail);
        emailService.sendOtpMail(normalizedEmail, otp);
        return "OTP sent to " + normalizedEmail;
    }

    public String verifyOtpAndSaveUser(String email, String password, String otp) {
        String normalizedEmail = normalizeEmail(email);
        String validationError = validateCredentials(normalizedEmail, password);
        if (validationError != null) {
            return validationError;
        }

        if (!otpService.verifyOtp(normalizedEmail, otp)) {
            return "Invalid OTP";
        }

        User existing = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (existing != null) {
            return "Email already registered";
        }

        User user = new User(normalizedEmail, passwordEncoder.encode(password));
        userRepository.save(user);
        return "User verified and registered";
    }

    public String login(String email, String password) {
        String normalizedEmail = normalizeEmail(email);
        String validationError = validateEmailOnly(normalizedEmail);
        if (validationError != null) {
            return validationError;
        }

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (user == null) {
            return "Invalid credentials";
        }
        if (!passwordMatches(user, password)) {
            return "Invalid credentials";
        }
        return "Login successful";
    }

    public String changePassword(String email, String currentPassword, String newPassword) {
        String normalizedEmail = normalizeEmail(email);
        String validationError = validatePassword(newPassword);
        if (validationError != null) {
            return validationError;
        }

        String emailError = validateEmailOnly(normalizedEmail);
        if (emailError != null) {
            return emailError;
        }

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (user == null) {
            return "User not found";
        }

        if (!passwordMatches(user, currentPassword)) {
            return "Current password is incorrect";
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Password updated";
    }

    private String validateCredentials(String email, String password) {
        String emailError = validateEmailOnly(email);
        if (emailError != null) {
            return emailError;
        }
        return validatePassword(password);
    }

    private String validateEmailOnly(String email) {
        if (email == null || email.isBlank()) {
            return "Email is required";
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return "Invalid email format";
        }
        return null;
    }

    private String validatePassword(String password) {
        if (password == null || password.isBlank()) {
            return "Password is required";
        }
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            return PASSWORD_REQUIREMENTS;
        }
        return null;
    }

    private boolean passwordMatches(User user, String rawPassword) {
        if (passwordEncoder.matches(rawPassword, user.getPassword())) {
            return true;
        }
        if (user.getPassword().equals(rawPassword)) {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public String forgotPassword(String email) {
        String normalizedEmail = normalizeEmail(email);
        String emailError = validateEmailOnly(normalizedEmail);
        if (emailError != null) {
            return emailError;
        }

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (user == null) {
            return "User not found";
        }

        String otp = otpService.generateOtp(normalizedEmail);
        emailService.sendOtpMail(normalizedEmail, otp);
        return "OTP sent to " + normalizedEmail;
    }

    public String resetPassword(String email, String otp, String newPassword) {
        String normalizedEmail = normalizeEmail(email);
        String emailError = validateEmailOnly(normalizedEmail);
        if (emailError != null) {
            return emailError;
        }

        String passwordError = validatePassword(newPassword);
        if (passwordError != null) {
            return passwordError;
        }

        if (!otpService.verifyOtp(normalizedEmail, otp)) {
            return "Invalid OTP";
        }

        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (user == null) {
            return "User not found";
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Password reset successful";
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim();
    }
}
