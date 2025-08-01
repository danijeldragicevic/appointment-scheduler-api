package com.productdock.appointmentscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityDto {
    private String provider;
    private String date; // "yyyy-MM-dd"
    private List<String> available_times;
}
