package com.productdock.appointmentscheduler.service;

import com.productdock.appointmentscheduler.dto.CreateUserRequest;
import com.productdock.appointmentscheduler.dto.UserDto;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    UserDto getUserById(Integer id);
    UserDto createUser(CreateUserRequest request);
}
