package com.personalmanagement.backend.Entity;

public enum TaskPriority {
    LOW("low"),
    MEDIUM("medium"),
    HIGH("high");

    private final String value;

    TaskPriority(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static TaskPriority fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalizedValue = value.trim().toLowerCase();
        for (TaskPriority priority : values()) {
            if (priority.value.equals(normalizedValue)) {
                return priority;
            }
        }

        throw new IllegalArgumentException("Invalid task priority: " + value);
    }
}
