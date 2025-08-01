package com.productdock.appointmentscheduler.service;

import com.productdock.appointmentscheduler.dto.AvailabilityDto;

import java.util.List;

public interface AvailabilityService {
    List<AvailabilityDto> getAvailability(String date, String provider);
}
