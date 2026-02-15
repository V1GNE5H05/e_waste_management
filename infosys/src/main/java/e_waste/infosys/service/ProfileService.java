package e_waste.infosys.service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import e_waste.infosys.entity.Profile;
import e_waste.infosys.entity.User;
import e_waste.infosys.repository.ProfileRepository;
import e_waste.infosys.repository.UserRepository;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    private static final Pattern MOBILE_PATTERN = Pattern.compile("^\\d{10}$");
    private static final Pattern PINCODE_PATTERN = Pattern.compile("^\\d{6}$");

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public Profile getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return null;
        }
        Profile profile = profileRepository.findByUserEmail(email).orElse(null);
        if (profile == null) {
            profile = profileRepository.save(new Profile(user));
        }
        return profile;
    }

    public Profile upsertProfile(String email, String name, String mobileNumber, 
            String street, String landmark, String city, String state, String pincode) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return null;
        }
        String normalizedMobile = normalizeMobile(mobileNumber);
        validateMobile(normalizedMobile);
        String normalizedPincode = normalizePincode(pincode);
        validatePincode(normalizedPincode);
        Profile profile = profileRepository.findByUserEmail(email).orElse(null);
        if (profile == null) {
            profile = new Profile(user);
        }
        profile.setName(name);
        profile.setMobileNumber(normalizedMobile);
        profile.setStreet(street);
        profile.setLandmark(landmark);
        profile.setCity(city);
        profile.setState(state);
        profile.setPincode(normalizedPincode);
        profile.setUser(user);
        return profileRepository.save(profile);
    }

    private void validateMobile(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.isBlank()) {
            return;
        }
        if (!MOBILE_PATTERN.matcher(mobileNumber).matches()) {
            throw new IllegalArgumentException("Mobile number must be exactly 10 digits.");
        }
    }

    private void validatePincode(String pincode) {
        if (pincode == null || pincode.isBlank()) {
            return;
        }
        if (!PINCODE_PATTERN.matcher(pincode).matches()) {
            throw new IllegalArgumentException("Pincode must be exactly 6 digits.");
        }
    }

    private String normalizeMobile(String mobileNumber) {
        return mobileNumber == null ? "" : mobileNumber.trim();
    }

    private String normalizePincode(String pincode) {
        return pincode == null ? "" : pincode.trim();
    }
}
