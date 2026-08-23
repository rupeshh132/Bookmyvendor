package com.bookmyvendor.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.util.Base64;

@Configuration
public class FirebaseConfig {

    @Value("${FIREBASE_CREDENTIALS_BASE64:}")
    private String firebaseCredentialsBase64;

    @PostConstruct
    public void init() {
        try {
            InputStream serviceAccount;
            if (firebaseCredentialsBase64 != null && !firebaseCredentialsBase64.isEmpty()) {
                byte[] decodedBytes = Base64.getDecoder().decode(firebaseCredentialsBase64);
                serviceAccount = new ByteArrayInputStream(decodedBytes);
            } else {
                serviceAccount = getClass().getClassLoader().getResourceAsStream("firebase-service-account.json");
            }

            if (serviceAccount == null) return;
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
