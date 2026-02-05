package com.example.grc.repository;

import com.example.grc.domain.entity.Risk;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskRepository extends JpaRepository<Risk, Long> {

    List<Risk> findByLevel(String level);
}
