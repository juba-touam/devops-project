package com.example.userservicejava.services;

import com.example.userservicejava.models.dto.UserRequest;
import com.example.userservicejava.models.dto.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest userRequestDTO);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(Long id, UserRequest userRequestDTO);
    void deleteUser(Long id);
}
