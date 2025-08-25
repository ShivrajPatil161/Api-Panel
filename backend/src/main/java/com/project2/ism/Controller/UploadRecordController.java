package com.project2.ism.Controller;

import com.project2.ism.Model.UploadRecord;
import com.project2.ism.Service.UploadRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class UploadRecordController {

    private final UploadRecordService service;

    public UploadRecordController(UploadRecordService service) { this.service = service; }

    @PostMapping
    public ResponseEntity<?> upload(
            @RequestParam String vendorName,
            @RequestParam String product,
            @RequestParam MultipartFile file
    ) {
        try {
            UploadRecord rec = service.handleFileUpload(vendorName, product, file);
            return ResponseEntity.ok(rec);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed: " + e.getMessage());
        }
    }
}
