package com.example.grc.service.impl;

import com.example.grc.domain.entity.Risk;
import com.example.grc.dto.RiskRequest;
import com.example.grc.dto.RiskResponse;
import com.example.grc.repository.RiskRepository;
import com.example.grc.service.RiskService;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RiskServiceImpl implements RiskService {

    private final RiskRepository riskRepository;

    public RiskServiceImpl(RiskRepository riskRepository) {
        this.riskRepository = riskRepository;
    }

    @Override
    @Transactional
    public RiskResponse assessRisk(RiskRequest request) {
        int score = request.getLikelihood() * request.getImpact();
        String level = mapLevel(score);

        Risk risk = new Risk();
        risk.setAsset(request.getAsset());
        risk.setThreat(request.getThreat());
        risk.setLikelihood(request.getLikelihood());
        risk.setImpact(request.getImpact());
        risk.setScore(score);
        risk.setLevel(level);

        Risk saved = riskRepository.save(risk);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RiskResponse> getRisks(String level) {
        List<Risk> risks;
        if (level == null || level.isBlank()) {
            risks = riskRepository.findAll();
        } else if (isKnownLevel(level)) {
            risks = riskRepository.findByLevel(level);
        } else {
            risks = new ArrayList<>();
        }

        List<RiskResponse> responses = new ArrayList<>(risks.size());
        for (Risk risk : risks) {
            responses.add(toResponse(risk));
        }
        return responses;
    }

    private boolean isKnownLevel(String level) {
        return "Low".equals(level)
                || "Medium".equals(level)
                || "High".equals(level)
                || "Critical".equals(level);
    }

    private String mapLevel(int score) {
        if (score <= 5) {
            return "Low";
        }
        if (score <= 12) {
            return "Medium";
        }
        if (score <= 18) {
            return "High";
        }
        return "Critical";
    }

    private RiskResponse toResponse(Risk risk) {
        return new RiskResponse(
                risk.getId(),
                risk.getAsset(),
                risk.getThreat(),
                risk.getLikelihood(),
                risk.getImpact(),
                risk.getScore(),
                risk.getLevel()
        );
    }
}
