package e_waste.infosys.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private static final long OTP_VALIDITY_MILLIS = 1 * 60 * 1000; // 1 minute
    private static final int MAX_ATTEMPTS = 5;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    public String generateOtp(String email) {
        String otp = String.valueOf(100000 + SECURE_RANDOM.nextInt(900000));
        otpStore.put(email, new OtpEntry(otp, Instant.now(), 0));
        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null) {
            return false;
        }

        if (Instant.now().toEpochMilli() - entry.createdAt().toEpochMilli() > OTP_VALIDITY_MILLIS) {
            otpStore.remove(email);
            return false;
        }

        if (entry.attempts() >= MAX_ATTEMPTS) {
            otpStore.remove(email);
            return false;
        }

        if (entry.otp().equals(otp)) {
            otpStore.remove(email); 
            return true;
        }

        otpStore.put(email, new OtpEntry(entry.otp(), entry.createdAt(), entry.attempts() + 1));
        return false;
    }

    private record OtpEntry(String otp, Instant createdAt, int attempts) {}
}
