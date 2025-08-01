package com.productdock.appointmentscheduler.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ApiError {
    private String timestamp;
    private int status;
    private String error;
    private String path;

    public ApiError(int status, String error, String path) {
        this.timestamp = LocalDateTime.now().toString();
        this.status = status;
        this.error = error;
        this.path = path;
    }
}
