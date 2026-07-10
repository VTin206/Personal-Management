package com.personalmanagement.backend.Entity;

public enum TaskStatus {
    TODO("todo"),
    IN_PROGRESS("in-progress"),
    COMPLETED("completed");

    private final String value;

    TaskStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static TaskStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalizedValue = value.trim().toLowerCase().replace("_", "-");
        for (TaskStatus status : values()) {
            if (status.value.equals(normalizedValue)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Invalid task status: " + value);
    }
}
