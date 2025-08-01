package com.productdock.appointmentscheduler.service.impl;

import com.productdock.appointmentscheduler.dto.ServiceDto;
import com.productdock.appointmentscheduler.repository.ServiceRepository;
import com.productdock.appointmentscheduler.service.ServiceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceServiceImpl(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Override
    public List<ServiceDto> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(service -> new ServiceDto(
                        service.getId(),
                        service.getName(),
                        service.getDuration(),
                        service.getPrice()))
                .toList();
    }
}
