package com.productdock.appointmentscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private Integer id;
    private String user;
    private String provider;
    private String service;
    private String time; // "HH:mm"
    private String date; // "yyyy-MM-dd"
    private String status;
}
