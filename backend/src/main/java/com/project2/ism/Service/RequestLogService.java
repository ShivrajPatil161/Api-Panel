//package com.project2.ism.Service;
//
//import com.project2.ism.Model.RequestLog;
//import com.project2.ism.Repository.RequestLogRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@Service
//public class RequestLogService {
//
//    @Autowired
//    private RequestLogRepository requestLogRepository;
//
//    @Async
//    public void saveLogAsync(RequestLog requestLog) {
//        try {
//            requestLogRepository.save(requestLog);
//        } catch (Exception e) {
//            // Log the error but don't let logging failure affect the main request
//            System.err.println("Failed to save request log: " + e.getMessage());
//        }
//    }
//
//    public RequestLog saveLog(RequestLog requestLog) {
//        return requestLogRepository.save(requestLog);
//    }
//
//    public Optional<RequestLog> findById(Long id) {
//        return requestLogRepository.findById(id);
//    }
//
//    public List<RequestLog> findAllLogs() {
//        return requestLogRepository.findAll();
//    }
//
//    public Page<RequestLog> findAllLogs(Pageable pageable) {
//        return requestLogRepository.findByOrderByCreatedAtDesc(pageable);
//    }
//
//    public List<RequestLog> findLogsByUserId(String userId) {
//        return requestLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
//    }
//
//    public Page<RequestLog> findLogsByUserId(String userId, Pageable pageable) {
//        return requestLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
//    }
//
//    public List<RequestLog> findLogsByUsername(String username) {
//        return requestLogRepository.findByUsernameOrderByCreatedAtDesc(username);
//    }
//
//    public List<RequestLog> findLogsByMethod(String method) {
//        return requestLogRepository.findByRequestMethodOrderByCreatedAtDesc(method);
//    }
//
//    public List<RequestLog> findLogsByStatus(Integer status) {
//        return requestLogRepository.findByResponseStatusOrderByCreatedAtDesc(status);
//    }
//
//    public List<RequestLog> findLogsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
//        return requestLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startDate, endDate);
//    }
//
//    public List<RequestLog> findLogsByUserAndDateRange(String userId, LocalDateTime startDate, LocalDateTime endDate) {
//        return requestLogRepository.findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, startDate, endDate);
//    }
//
//    public List<RequestLog> findErrorLogs() {
//        return requestLogRepository.findErrorLogs();
//    }
//
//    public List<RequestLog> findSlowRequests(Long executionTimeThreshold) {
//        return requestLogRepository.findSlowRequests(executionTimeThreshold);
//    }
//
//    public Long countRequestsByUser(String userId) {
//        return requestLogRepository.countRequestsByUserId(userId);
//    }
//
//    public Page<RequestLog> searchLogs(String userId, String method, Integer status,
//                                       LocalDateTime startDate, LocalDateTime endDate,
//                                       Pageable pageable) {
//        return requestLogRepository.findLogsByFilters(userId, method, status, startDate, endDate, pageable);
//    }
//
//    @Transactional
//    public void deleteLog(Long id) {
//        requestLogRepository.deleteById(id);
//    }
//
//    @Transactional
//    public void deleteOldLogs(LocalDateTime cutoffDate) {
//        requestLogRepository.deleteByCreatedAtBefore(cutoffDate);
//    }
//
//    // Scheduled task to clean up old logs (runs daily at midnight)
//    @Scheduled(cron = "0 0 0 * * ?")
//    @Transactional
//    public void cleanupOldLogs() {
//        // Delete logs older than 30 days
//        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
//        deleteOldLogs(cutoffDate);
//        System.out.println("Cleaned up request logs older than " + cutoffDate);
//    }
//
//    // Statistics methods
//    public long getTotalRequestCount() {
//        return requestLogRepository.count();
//    }
//
//    public List<RequestLog> getTodaysLogs() {
//        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
//        LocalDateTime endOfDay = startOfDay.plusDays(1);
//        return findLogsByDateRange(startOfDay, endOfDay);
//    }
//
//    public List<RequestLog> getRecentErrorLogs(int hours) {
//        LocalDateTime since = LocalDateTime.now().minusHours(hours);
//        return requestLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(since, LocalDateTime.now())
//                .stream()
//                .filter(log -> log.getResponseStatus() != null && log.getResponseStatus() >= 400)
//                .toList();
//    }
//
//    public List<RequestLog> getLoginLogs() {
//        return requestLogRepository.findByRequestUrlContainingOrderByCreatedAtDesc("/login");
//    }
//
//    public List<RequestLog> getLogoutLogs() {
//        return requestLogRepository.findByRequestUrlContainingOrderByCreatedAtDesc("/logout");
//    }
//
//    public List<RequestLog> getCreateLogs() {
//        return requestLogRepository.findByRequestMethodAndResponseStatusBetweenOrderByCreatedAtDesc("POST", 200, 299);
//    }
//
//    public List<RequestLog> getEditLogs() {
//        return requestLogRepository.findByRequestMethodAndResponseStatusBetweenOrderByCreatedAtDesc("PUT", 200, 299);
//    }
//
//    public List<RequestLog> getDeleteLogs() {
//        return requestLogRepository.findByRequestMethodAndResponseStatusBetweenOrderByCreatedAtDesc("DELETE", 200, 299);
//    }
//
//    public List<RequestLog> getFailedAttempts() {
//        return requestLogRepository.findByResponseStatusGreaterThanEqualOrderByCreatedAtDesc(400);
//    }
//
//    public List<RequestLog> getAdminActions() {
//        return requestLogRepository.findByRequestUrlContainingAndResponseStatusBetweenOrderByCreatedAtDesc("/admin", 200, 299);
//    }
//
//    public List<RequestLog> getUserManagementLogs() {
//        List<RequestLog> logs = new ArrayList<>();
//        logs.addAll(requestLogRepository.findByRequestUrlContainingOrderByCreatedAtDesc("/users"));
//        logs.addAll(requestLogRepository.findByRequestUrlContainingOrderByCreatedAtDesc("/admins"));
//        return logs.stream().sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())).collect(Collectors.toList());
//    }
//
//    public List<RequestLog> getDataExports() {
//        List<RequestLog> logs = new ArrayList<>();
//        logs.addAll(requestLogRepository.findByRequestUrlContainingOrderByCreatedAtDesc("/export"));
//        logs.addAll(requestLogRepository.findByRequestUrlContainingOrderByCreatedAtDesc("/download"));
//        return logs.stream().sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt())).collect(Collectors.toList());
//    }
//}
