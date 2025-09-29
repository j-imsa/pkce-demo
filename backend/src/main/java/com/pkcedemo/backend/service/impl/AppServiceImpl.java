package com.pkcedemo.backend.service.impl;

import com.pkcedemo.backend.service.AppService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppServiceImpl implements AppService {

    @Override
    public List<String> getListOfNames() {
        return List.of("Alice", "Bob", "Charlie", "Diana");
    }

}
