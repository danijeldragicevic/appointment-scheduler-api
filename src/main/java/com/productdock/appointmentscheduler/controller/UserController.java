package com.productdock.appointmentscheduler.controller;

import com.productdock.appointmentscheduler.dto.CreateUserRequest;
import com.productdock.appointmentscheduler.dto.UserDto;
import com.productdock.appointmentscheduler.exception.ConflictException;
import com.productdock.appointmentscheduler.exception.ResourceNotFoundException;
import com.productdock.appointmentscheduler.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDto getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        UserDto created = userService.createUser(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
