package com.productdock.appointmentscheduler.service.impl;

import com.productdock.appointmentscheduler.dto.AvailabilityDto;
import com.productdock.appointmentscheduler.model.Availability;
import com.productdock.appointmentscheduler.repository.AvailabilityRepository;
import com.productdock.appointmentscheduler.service.AvailabilityService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvailabilityServiceImpl implements AvailabilityService {

    private final AvailabilityRepository availabilityRepository;

    public AvailabilityServiceImpl(AvailabilityRepository availabilityRepository) {
        this.availabilityRepository = availabilityRepository;
    }

    @Override
    public List<AvailabilityDto> getAvailability(String date, String provider) {
        List<Availability> availabilities;
        if (date != null && provider != null) {
            availabilities = availabilityRepository.findByDateAndProviderName(date, provider);
        } else if (date != null) {
            availabilities = availabilityRepository.findByDate(date);
        } else if (provider != null) {
            availabilities = availabilityRepository.findByProviderName(provider);
        } else {
            availabilities = availabilityRepository.findAll();
        }
        return availabilities.stream()
                .map(a -> new AvailabilityDto(
                        a.getProvider().getName(),
                        a.getDate(),
                        a.getAvailableTimes()
                ))
                .collect(Collectors.toList());
    }
}
