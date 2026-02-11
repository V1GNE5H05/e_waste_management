package e_waste.infosys.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String mailFrom;

    public EmailService(JavaMailSender mailSender, @Value("${spring.mail.username:}") String mailFrom) {
        this.mailSender = mailSender;
        this.mailFrom = mailFrom;
    }

    public void sendOtpMail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        if (!mailFrom.isBlank()) {
            message.setFrom(mailFrom);
        }
        message.setTo(toEmail);
        message.setSubject("Your OTP Verification Code");
        message.setText("Your OTP is: " + otp);

        mailSender.send(message);
    }
}
