package com.productdock.appointmentscheduler.service;

import com.productdock.appointmentscheduler.dto.AppointmentDto;
import com.productdock.appointmentscheduler.dto.CreateAppointmentRequest;

import java.util.List;

public interface AppointmentService {
    List<AppointmentDto> getAllAppointments();
    AppointmentDto getAppointmentById(Integer id);
    AppointmentDto createAppointment(CreateAppointmentRequest request);
    AppointmentDto updateAppointment(Integer id, CreateAppointmentRequest request);
    void deleteAppointment(Integer id);
}
