package com.productdock.appointmentscheduler.service.impl;

import com.productdock.appointmentscheduler.dto.CreateUserRequest;
import com.productdock.appointmentscheduler.dto.UserDto;
import com.productdock.appointmentscheduler.exception.ResourceNotFoundException;
import com.productdock.appointmentscheduler.model.User;
import com.productdock.appointmentscheduler.repository.UserRepository;
import com.productdock.appointmentscheduler.service.UserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhone()))
                .toList();
    }

    @Override
    public UserDto getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " not found."));
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone());
    }

    @Override
    public UserDto createUser(CreateUserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        User savedUser = userRepository.save(user);

        return new UserDto(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone());
    }
}
