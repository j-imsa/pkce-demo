package com.pkcedemo.backend.service;

import com.pkcedemo.backend.model.dto.UserRegistrationDto;
import com.pkcedemo.backend.model.entity.User;

public interface UserManagementService {
    User registerUser(UserRegistrationDto registrationDto);

    void deleteUser(Long userId);
}
