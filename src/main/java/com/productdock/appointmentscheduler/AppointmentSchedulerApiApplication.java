package com.productdock.appointmentscheduler;

import com.productdock.appointmentscheduler.dto.*;
import com.productdock.appointmentscheduler.model.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;

@SpringBootApplication
public class AppointmentSchedulerApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppointmentSchedulerApiApplication.class, args);
    }
}