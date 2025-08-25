package com.project2.ism.Service;

// Service/UploadRecordService.java

import com.project2.ism.Model.Transaction;
import com.project2.ism.Model.UploadRecord;
import com.project2.ism.Repository.TransactionRepository;
import com.project2.ism.Repository.UploadRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class UploadRecordService {

    private final TransactionRepository transactionRepository;
    private final UploadRecordRepository uploadRecordRepository;

    public UploadRecordService(TransactionRepository tr, UploadRecordRepository ur) {
        this.transactionRepository = tr;
        this.uploadRecordRepository = ur;
    }

    public UploadRecord handleFileUpload(String vendorName, String product, MultipartFile file) throws Exception {
        UploadRecord rec = new UploadRecord();
        rec.setVendorName(vendorName);
        rec.setProduct(product);
        rec.setFileName(file.getOriginalFilename());
        uploadRecordRepository.save(rec);

        List<Transaction> txs = ExcelParser.parse(file.getInputStream());
        transactionRepository.saveAll(txs);
        return rec;
    }
}
