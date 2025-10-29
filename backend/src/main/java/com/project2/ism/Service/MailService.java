//package com.project2.ism.Service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class MailService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    @Value("${spring.mail.username}")
//    private String fromEmail;
//
//    @Async
//    public void sendEmail(List<String> to, String subject, String body) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(to.toArray(new String[0]));
//        message.setSubject(subject);
//        message.setText(body);
//        message.setFrom(fromEmail);
//
//        mailSender.send(message);
//    }
//}
