package com.productdock.appointmentscheduler.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDto {
    private Integer id;
    private String name;
    private Integer duration; // in minutes
    private Integer price;
}
