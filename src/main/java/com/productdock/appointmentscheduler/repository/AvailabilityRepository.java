package com.productdock.appointmentscheduler.repository;

import com.productdock.appointmentscheduler.model.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Integer> {
    List<Availability> findByDateAndProviderName(String date, String provider);
    List<Availability> findByDate(String date);
    List<Availability> findByProviderName(String provider);
    boolean existsByProviderNameAndDateAndAvailableTimesContaining(String providerName, String date, String time);
    Optional<Availability> findByProviderNameAndDateAndAvailableTimes(String providerName, String date, String time);
}
