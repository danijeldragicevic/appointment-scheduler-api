package com.productdock.appointmentscheduler.config;

import com.productdock.appointmentscheduler.model.Availability;
import com.productdock.appointmentscheduler.model.Provider;
import com.productdock.appointmentscheduler.model.Service;
import com.productdock.appointmentscheduler.repository.AvailabilityRepository;
import com.productdock.appointmentscheduler.repository.ProviderRepository;
import com.productdock.appointmentscheduler.repository.ServiceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initServices(
            ServiceRepository serviceRepository,
            ProviderRepository providerRepository,
            AvailabilityRepository availabilityRepository) {

        return args -> {
            // create services
            if (serviceRepository.count() == 0) {
                serviceRepository.save(new Service(null, "Check-up", 30, 100));
                serviceRepository.save(new Service(null, "Consultation", 45, 150));
                serviceRepository.save(new Service(null, "Follow-up", 15, 75));
            }
            // create providers
            Provider drSmith = new Provider(null, "Dr. Smith", "dr.smith@example.com", "555-0201");
            Provider drBrown = new Provider(null, "Dr. Brown", "dr.brown@example.com", "555-0202");
            if (providerRepository.count() == 0) {
                providerRepository.save(drSmith);
                providerRepository.save(drBrown);
            }
            // create availabilities
            if (availabilityRepository.count() == 0) {
                availabilityRepository.save(new Availability(
                        null,
                        drSmith,
                        "2025-07-23",
                        List.of("09:00", "10:30", "14:00", "15:30")
                ));
                availabilityRepository.save(new Availability(
                        null,
                        drBrown,
                        "2025-07-24",
                        List.of("10:00", "13:00", "16:00")
                ));
            }
        };
    }
}
