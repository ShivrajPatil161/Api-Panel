package com.project2.ism.Service;

// Service/UploadRecordService.java

import com.project2.ism.Exception.ResourceNotFoundException;
import com.project2.ism.Model.Product;
import com.project2.ism.Model.VendorTransactions;
import com.project2.ism.Model.UploadRecord;
import com.project2.ism.Model.Vendor.Vendor;
import com.project2.ism.Repository.ProductRepository;
import com.project2.ism.Repository.TransactionRepository;
import com.project2.ism.Repository.UploadRecordRepository;
import com.project2.ism.Repository.VendorRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class UploadRecordService {

    private final TransactionRepository transactionRepository;
    private final UploadRecordRepository uploadRecordRepository;
    private final VendorRepository vendorRepository;
    private final ProductRepository productRepository;
    private final ExcelParser excelParser;


    public UploadRecordService(TransactionRepository tr, UploadRecordRepository ur, VendorRepository vendorRepository, ProductRepository productRepository, ExcelParser excelParser) {
        this.transactionRepository = tr;
        this.uploadRecordRepository = ur;
        this.vendorRepository = vendorRepository;
        this.productRepository = productRepository;
        this.excelParser = excelParser;
    }

    public String handleFileUpload(Long vendorId, Long productId, MultipartFile file) throws Exception {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        UploadRecord rec = new UploadRecord();
        rec.setVendor(vendor);
        rec.setProduct(product);
        rec.setFileName(file.getOriginalFilename());


        List<VendorTransactions> txs = excelParser.parse(file.getInputStream());
        transactionRepository.saveAll(txs);
        uploadRecordRepository.save(rec);
        return "Success";
    }
}
