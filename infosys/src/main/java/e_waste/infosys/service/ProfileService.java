package e_waste.infosys.service;

import java.util.Optional;
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

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    public Profile getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return null;
        }
        Optional<Profile> existing = profileRepository.findByUserEmail(email);
        return existing.orElseGet(() -> profileRepository.save(new Profile(user)));
    }

    public Profile upsertProfile(String email, String name, String mobileNumber, String address) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return null;
        }
        String normalizedMobile = normalizeMobile(mobileNumber);
        validateMobile(normalizedMobile);
        Profile profile = profileRepository.findByUserEmail(email).orElseGet(() -> new Profile(user));
        profile.setName(name);
        profile.setMobileNumber(normalizedMobile);
        profile.setAddress(address);
        profile.setUser(user);
        return profileRepository.save(profile);
    }

    private void validateMobile(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.isBlank()) {
            return; // optional field
        }
        if (!MOBILE_PATTERN.matcher(mobileNumber).matches()) {
            throw new IllegalArgumentException("Mobile number must be exactly 10 digits.");
        }
    }

    private String normalizeMobile(String mobileNumber) {
        return mobileNumber == null ? "" : mobileNumber.trim();
    }
}
