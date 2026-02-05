package com.example.grc.service;

import com.example.grc.dto.RiskRequest;
import com.example.grc.dto.RiskResponse;
import java.util.List;

public interface RiskService {

    RiskResponse assessRisk(RiskRequest request);

    List<RiskResponse> getRisks(String level);
}
