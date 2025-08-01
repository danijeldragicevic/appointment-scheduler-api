package com.productdock.appointmentscheduler.service.impl;

import com.productdock.appointmentscheduler.dto.AppointmentDto;
import com.productdock.appointmentscheduler.dto.CreateAppointmentRequest;
import com.productdock.appointmentscheduler.exception.ConflictException;
import com.productdock.appointmentscheduler.exception.ResourceNotFoundException;
import com.productdock.appointmentscheduler.model.*;
import com.productdock.appointmentscheduler.repository.*;
import com.productdock.appointmentscheduler.service.AppointmentService;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AvailabilityRepository availabilityRepository;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final ServiceRepository serviceRepository;

    public AppointmentServiceImpl(
            AppointmentRepository appointmentRepository, AvailabilityRepository availabilityRepository, UserRepository userRepository,
            ProviderRepository providerRepository, ServiceRepository serviceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
        this.userRepository = userRepository;
        this.providerRepository = providerRepository;
        this.serviceRepository = serviceRepository;
    }

    @Override
    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(appointment -> new AppointmentDto(
                        appointment.getId(),
                        appointment.getUser().getName(),
                        appointment.getProvider().getName(),
                        appointment.getService().getName(),
                        appointment.getTime(),
                        appointment.getDate(),
                        appointment.getStatus()))
                .toList();
    }

    @Override
    public AppointmentDto getAppointmentById(Integer id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment with id " + id + " not found."));
        return new AppointmentDto(
                appointment.getId(),
                appointment.getUser().getName(),
                appointment.getProvider().getName(),
                appointment.getService().getName(),
                appointment.getTime(),
                appointment.getDate(),
                appointment.getStatus()
        );
    }

    @Override
    @Transactional
    public AppointmentDto createAppointment(CreateAppointmentRequest request) {
        User user = getUserByNameOrThrow(request.getUser());
        Provider provider = getProviderByNameOrThrow(request.getProvider());
        Service service = getServiceByNameOrThrow(request.getService());
        Availability availability = getAvailabilityOrThrow(request.getProvider(), request.getDate(), request.getTime());

        removeTimeAndSaveAvailability(availability, request.getTime());

        Appointment appointment = createAndSaveAppointment(request, user, provider, service);

        return mapToDto(appointment, user, provider, service);
    }

    private User getUserByNameOrThrow(String name) {
        return userRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Provider getProviderByNameOrThrow(String name) {
        return providerRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
    }

    private Service getServiceByNameOrThrow(String name) {
        return serviceRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
    }

    private Availability getAvailabilityOrThrow(String provider, String date, String time) {
        return availabilityRepository.findByProviderNameAndDateAndAvailableTimes(provider, date, time)
                .orElseThrow(() -> new ConflictException("The provider is not available at requested time."));
    }

    private void removeTimeAndSaveAvailability(Availability availability, String time) {
        availability.getAvailableTimes().remove(time);
        availabilityRepository.save(availability);
    }

    private Appointment createAndSaveAppointment(CreateAppointmentRequest request, User user, Provider provider, Service service) {
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setProvider(provider);
        appointment.setService(service);
        appointment.setDate(request.getDate());
        appointment.setTime(request.getTime());
        appointment.setStatus("scheduled");
        return appointmentRepository.save(appointment);
    }

    private static AppointmentDto mapToDto(Appointment appointment, User user, Provider provider, Service service) {
        return new AppointmentDto(
                appointment.getId(),
                user.getName(),
                provider.getName(),
                service.getName(),
                appointment.getTime(),
                appointment.getDate(),
                appointment.getStatus()
        );
    }

    @Override
    public AppointmentDto updateAppointment(Integer id, CreateAppointmentRequest request) {
        return new AppointmentDto();
    }

    @Override
    public void deleteAppointment(Integer id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment with id " + id + " not found."));
        appointmentRepository.delete(appointment);
    }

}
