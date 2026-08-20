package com.bookmyvendor.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    // ── Send password reset email ────────────────────────────────
    @Async
    public void sendPasswordResetEmail(String toEmail, String resetToken, String userName) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
        String html = buildPasswordResetEmail(userName, resetLink);
        sendHtmlEmail(toEmail, "Reset Your BookMyVendor Password", html);
    }

    // ── Send welcome email ───────────────────────────────────────
    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        String html = buildWelcomeEmail(userName);
        sendHtmlEmail(toEmail, "Welcome to BookMyVendor! 🎉", html);
    }

    // ── Core send method ─────────────────────────────────────────
    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "BookMyVendor");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            mailSender.send(message);
            log.info("Email sent to {}: {}", to, subject);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("Email error: {}", e.getMessage());
        }
    }

    // ── Email Templates ──────────────────────────────────────────
    private String buildPasswordResetEmail(String name, String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: 'General Sans', Arial, sans-serif; background-color: #F6F3EF; margin: 0; padding: 40px 20px;">
              <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 28px; overflow: hidden; box-shadow: 0 2px 12px rgba(22,35,46,0.08);">
                <!-- Header -->
                <div style="background-color: #16232E; padding: 32px 40px;">
                  <h1 style="color: #FFFFFF; font-size: 22px; margin: 0; letter-spacing: -0.5px;">
                    Book<span style="color: #D9A98C;">●</span>MyVendor
                  </h1>
                </div>
                <!-- Body -->
                <div style="padding: 40px;">
                  <h2 style="color: #1A1A1A; font-size: 24px; margin: 0 0 16px;">Reset Your Password</h2>
                  <p style="color: #6B6560; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                    Hi %s,<br><br>
                    We received a request to reset your password. Click the button below to create a new one.
                    This link will expire in <strong>15 minutes</strong>.
                  </p>
                  <a href="%s" style="display: inline-block; background-color: #16232E; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;">
                    Reset Password →
                  </a>
                  <p style="color: #6B6560; font-size: 13px; margin: 24px 0 0;">
                    If you didn't request this, you can safely ignore this email.
                    Your password won't change unless you use the link above.
                  </p>
                </div>
                <!-- Footer -->
                <div style="background-color: #EDEAE5; padding: 20px 40px; text-align: center;">
                  <p style="color: #6B6560; font-size: 12px; margin: 0;">
                    © 2025 BookMyVendor · Find. Compare. Book Trusted Vendors.
                  </p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, resetLink);
    }

    private String buildWelcomeEmail(String name) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; background-color: #F6F3EF; margin: 0; padding: 40px 20px;">
              <div style="max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 28px; overflow: hidden; box-shadow: 0 2px 12px rgba(22,35,46,0.08);">
                <div style="background-color: #16232E; padding: 32px 40px;">
                  <h1 style="color: #FFFFFF; font-size: 22px; margin: 0;">
                    Book<span style="color: #D9A98C;">●</span>MyVendor
                  </h1>
                </div>
                <div style="padding: 40px;">
                  <h2 style="color: #1A1A1A; font-size: 24px; margin: 0 0 16px;">Welcome, %s! 🎉</h2>
                  <p style="color: #6B6560; font-size: 16px; line-height: 1.6;">
                    You're now part of BookMyVendor — India's trusted platform for event vendors.
                    Start exploring verified vendors for your next celebration!
                  </p>
                  <a href="%s" style="display: inline-block; background-color: #D9A98C; color: #16232E; text-decoration: none; padding: 14px 28px; border-radius: 9999px; font-size: 13px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 16px;">
                    Explore Vendors →
                  </a>
                </div>
                <div style="background-color: #EDEAE5; padding: 20px 40px; text-align: center;">
                  <p style="color: #6B6560; font-size: 12px; margin: 0;">© 2025 BookMyVendor</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(name, frontendUrl + "/vendors");
    }
}
