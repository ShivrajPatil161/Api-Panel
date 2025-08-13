package com.project2.ism.Service;

import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.Users.Franchise;
import com.project2.ism.Repository.FranchiseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FranchiseService {

    private final FranchiseRepository franchiseRepository;

    public FranchiseService(FranchiseRepository franchiseRepository) {
        this.franchiseRepository = franchiseRepository;
    }

    public Franchise createFranchise(Franchise franchise) {
        return franchiseRepository.save(franchise);
    }

    public List<Franchise> getAllFranchises() {
        return franchiseRepository.findAll();
    }

    public Franchise getFranchiseById(Long id) {
        return franchiseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Franchise not found with ID: " + id));
    }

    public Franchise updateFranchise(Long id, Franchise franchiseDetails) {
        Franchise franchise = getFranchiseById(id); // throws exception if not found
        franchise.setFranchiseName(franchiseDetails.getFranchiseName());
        // Map other fields from CustomerBase if needed
        return franchiseRepository.save(franchise);
    }

    public void deleteFranchise(Long id) {
        Franchise franchise = getFranchiseById(id); // throws exception if not found
        franchiseRepository.delete(franchise);
    }
}