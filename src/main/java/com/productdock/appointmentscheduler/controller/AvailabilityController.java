package com.productdock.appointmentscheduler.controller;

import com.productdock.appointmentscheduler.dto.AvailabilityDto;
import com.productdock.appointmentscheduler.service.AvailabilityService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping
    public List<AvailabilityDto> getAvailability(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String provider) {
        return availabilityService.getAvailability(date, provider);
    }
}
