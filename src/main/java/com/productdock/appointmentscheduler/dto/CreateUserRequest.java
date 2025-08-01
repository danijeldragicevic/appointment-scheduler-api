package com.productdock.appointmentscheduler.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    private String phone;
}
