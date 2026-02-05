package com.example.grc.controller;

import com.example.grc.dto.RiskRequest;
import com.example.grc.dto.RiskResponse;
import com.example.grc.service.RiskService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = "http://localhost:*")
public class RiskController {

    private final RiskService riskService;

    public RiskController(RiskService riskService) {
        this.riskService = riskService;
    }

    @PostMapping("/assess-risk")
    public RiskResponse assessRisk(@Valid @RequestBody RiskRequest request) {
        return riskService.assessRisk(request);
    }

    @GetMapping("/risks")
    public List<RiskResponse> getRisks(@RequestParam(value = "level", required = false) String level) {
        return riskService.getRisks(level);
    }
}
