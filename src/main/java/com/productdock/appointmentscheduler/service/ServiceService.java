package com.productdock.appointmentscheduler.service;

import com.productdock.appointmentscheduler.dto.ServiceDto;

import java.util.List;

public interface ServiceService {
    List<ServiceDto> getAllServices();
}
