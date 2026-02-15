package e_waste.infosys.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String mailFrom;

    public EmailService(JavaMailSender mailSender, @Value("${spring.mail.username:}") String mailFrom) {
        this.mailSender = mailSender;
        this.mailFrom = mailFrom;
    }

    public void sendOtpMail(String toEmail, String otp) {
        try {
            String templatePath = "../frontend1/otp.html";
            Path path = Path.of(System.getProperty("user.dir"), templatePath);
            String html = Files.readString(path, StandardCharsets.UTF_8);
            html = html.replace("[user@email.com]", toEmail)
                       .replace("[123456]", otp);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            if (!mailFrom.isBlank()) {
                helper.setFrom(mailFrom);
            }
            helper.setTo(toEmail);
            helper.setSubject("Your OTP Verification Code");
            helper.setText(html, true); 

            mailSender.send(message);
        } catch (Exception e) {
            try {
                jakarta.mail.internet.MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
                if (!mailFrom.isBlank()) {
                    helper.setFrom(mailFrom);
                }
                helper.setTo(toEmail);
                helper.setSubject("Your OTP Verification Code");
                helper.setText("Your OTP is: " + otp, false);
                mailSender.send(message);
            } catch (MessagingException ex) {
                throw new RuntimeException("Failed to send OTP email", ex);
            }
        }
    }
}
