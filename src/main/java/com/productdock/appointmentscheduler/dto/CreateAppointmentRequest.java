package com.productdock.appointmentscheduler.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAppointmentRequest {
    @NotBlank
    private String user;

    @NotBlank
    private String provider;

    @NotBlank
    private String service;

    @NotBlank
    private String time; // "HH:mm"

    @NotBlank
    private String date; // "yyyy-MM-dd"
}
