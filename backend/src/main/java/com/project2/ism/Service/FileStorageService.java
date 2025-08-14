package com.project2.ism.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {

    private final Path rootUploadPath = Paths.get("uploads", "franchises");

    public FileStorageService() {
        try {
            Files.createDirectories(rootUploadPath); // ✅ auto-create folder
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public String store(MultipartFile file, String type) {
        if (file == null || file.isEmpty()) return null;

        try {
            // Create subfolder for type
            Path folderPath = rootUploadPath.resolve(type);
            Files.createDirectories(folderPath);

            // Create unique filename
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // Save file
            Path filePath = folderPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return filePath.toString(); // store this path in DB
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + file.getOriginalFilename(), e);
        }
    }
}
