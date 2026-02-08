package e_waste.infosys.controller;

import e_waste.infosys.model.User;
import e_waste.infosys.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // REGISTER
    @PostMapping("/register")
    public String register(@RequestBody Map<String, String> data) {

        String email = data.get("email");
        String password = data.get("password");

        if (userRepository.findByEmail(email).isPresent()) {
            return "User already exists";
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(password);

        userRepository.save(user);
        return "Registered successfully";
    }

    // LOGIN
    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> data) {

        String email = data.get("email");
        String password = data.get("password");

        return userRepository.findByEmail(email)
                .map(user -> user.getPassword().equals(password)
                        ? "Login successful"
                        : "Wrong password")
                .orElse("User not found");
    }
}
