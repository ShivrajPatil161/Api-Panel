package com.project2.ism.Controller;

import com.project2.ism.Model.CardTypes;
import com.project2.ism.Service.CardTypesService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/card-types")
public class CardTypesController {

    private final CardTypesService cardTypesService;

    public CardTypesController(CardTypesService cardTypesService) {
        this.cardTypesService = cardTypesService;
    }

    @PostMapping
    public ResponseEntity<CardTypes> createCardType(@RequestBody CardTypes cardTypes){
        return ResponseEntity.ok(cardTypesService.createCardType(cardTypes));
    }

    @GetMapping
    public ResponseEntity<List<CardTypes>> getAllCardTypes(){
        return ResponseEntity.ok(cardTypesService.getAllCardTypes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CardTypes> getCardTypeById(@PathVariable Long id){
        return ResponseEntity.ok(cardTypesService.getCardTypeById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CardTypes> updateCardType(@PathVariable Long id,@RequestBody CardTypes cardTypes){
        return ResponseEntity.ok(cardTypesService.updateCardType(id, cardTypes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCardType(@PathVariable Long id){
        cardTypesService.deleteCardType(id);
        return ResponseEntity.ok("CardType deleted successfully");
    }
}
