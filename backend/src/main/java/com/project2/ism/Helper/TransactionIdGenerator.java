package com.project2.ism.Helper;

import org.hibernate.generator.EventType;
import org.hibernate.generator.BeforeExecutionGenerator;
import org.hibernate.engine.spi.SharedSessionContractImplementor;

import java.io.Serializable;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.EnumSet;
import java.util.concurrent.atomic.AtomicInteger;

public class TransactionIdGenerator implements BeforeExecutionGenerator {

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyMMddHHmmss");

    // Use AtomicInteger for better thread safety and performance
    private static final AtomicInteger counter = new AtomicInteger(0);

    // Consider making timezone configurable via properties
    private static final ZoneId SYSTEM_TIMEZONE = ZoneId.systemDefault();

    @Override
    public Object generate(SharedSessionContractImplementor session, Object owner, Object currentValue, EventType eventType) {
        if (currentValue != null) {
            return currentValue;
        }

        // Use ZonedDateTime for better timezone handling
        String timestamp = ZonedDateTime.now(SYSTEM_TIMEZONE).format(DATE_FORMATTER);

        // Get next counter value (1-999, then wraps to 1)
        int nextCounter = counter.updateAndGet(current -> (current % 999) + 1);

        return timestamp + String.format("%03d", nextCounter);
    }

    @Override
    public EnumSet<EventType> getEventTypes() {
        return EnumSet.of(EventType.INSERT);
    }

    // Optional: Method to reset counter for testing purposes
    public static void resetCounter() {
        counter.set(0);
    }

    // Optional: Method to get current counter value for monitoring
    public static int getCurrentCounter() {
        return counter.get();
    }
}