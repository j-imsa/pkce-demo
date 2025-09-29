package com.pkcedemo.backend.controller;

import com.pkcedemo.backend.service.AppService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AppController {

    private final AppService appService;

    @GetMapping("/list")
    public ResponseEntity<?> getList() {
        return ResponseEntity.ok(appService.getListOfNames());
    }
}
