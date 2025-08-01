package com.productdock.appointmentscheduler.controller;

import com.productdock.appointmentscheduler.dto.ServiceDto;
import com.productdock.appointmentscheduler.service.ServiceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/services")
public class ServicesController {

    private final ServiceService serviceService;

    public ServicesController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    public List<ServiceDto> getAllServices() {
        return serviceService.getAllServices();
    }
}
