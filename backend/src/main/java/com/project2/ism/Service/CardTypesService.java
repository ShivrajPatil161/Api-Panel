package com.project2.ism.Service;

import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.CardTypes;
import com.project2.ism.Repository.CardTypesRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CardTypesService {

        private final CardTypesRepository cardTypesRepository;

        public CardTypesService(CardTypesRepository cardTypesRepository) {
            this.cardTypesRepository = cardTypesRepository;
        }

        public CardTypes createCardType(CardTypes cardType) {
            return cardTypesRepository.save(cardType);
        }

        public List<CardTypes> getAllCardTypes() {
            return cardTypesRepository.findAll();
        }

        public CardTypes getCardTypeById(Long id) {
            return cardTypesRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("CardType not found with id: " + id));
        }

        public CardTypes updateCardType(Long id, CardTypes cardType) {
            CardTypes existing = getCardTypeById(id);
            existing.setCardName(cardType.getCardName());
            return cardTypesRepository.save(existing);
        }

        public void deleteCardType(Long id) {
            CardTypes existing = getCardTypeById(id);
            cardTypesRepository.delete(existing);
        }
}
