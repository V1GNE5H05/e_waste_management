package e_waste.infosys.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import e_waste.infosys.entity.Profile;
import e_waste.infosys.service.ProfileService;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(@RequestParam String email) {
        Profile profile = profileService.getProfileByEmail(email);
        if (profile == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ProfileResponse.from(profile));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody ProfileRequest request) {
        try {
            Profile profile = profileService.upsertProfile(
                    request.email(),
                    request.name(),
                    request.mobileNumber(),
                    request.street(),
                    request.landmark(),
                    request.city(),
                    request.state(),
                    request.pincode());
            if (profile == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(ProfileResponse.from(profile));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    public record ProfileRequest(String email, String name, String mobileNumber, 
            String street, String landmark, String city, String state, String pincode) {}

    public record ProfileResponse(String email, String name, String mobileNumber, 
            String street, String landmark, String city, String state, String pincode) {
        public static ProfileResponse from(Profile profile) {
            return new ProfileResponse(
                    profile.getUser().getEmail(),
                    profile.getName(),
                    profile.getMobileNumber(),
                    profile.getStreet(),
                    profile.getLandmark(),
                    profile.getCity(),
                    profile.getState(),
                    profile.getPincode());
        }
    }
}
