//package com.project2.ism.Model;
//
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotBlank;
//
//@Entity
//public class CardTypes {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @NotBlank(message = "Card Name Required")
//    @Column(nullable = false,unique = true)
//    private String cardName;
//
//    public CardTypes() {
//    }
//
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getCardName() {
//        return cardName;
//    }
//
//    public void setCardName(String cardName) {
//        this.cardName = cardName;
//    }
//}
