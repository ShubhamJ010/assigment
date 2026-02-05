import React, { useMemo } from 'react';
import { BarChart3, AlertTriangle, Target } from 'lucide-react';
import { Card } from '../common';
import type { Risk } from '../../types/risk';

interface RiskStatsProps {
  risks: Risk[];
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  color: 'blue' | 'orange' | 'green';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle, color }) => {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      valueColor: 'text-blue-700',
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      valueColor: 'text-orange-700',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      valueColor: 'text-green-700',
    },
  };

  const styles = colorStyles[color];

  return (
    <Card hover className={`${styles.bg} border-none`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${styles.valueColor}`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${styles.iconBg}`}>
          <div className={styles.iconColor}>{icon}</div>
        </div>
      </div>
    </Card>
  );
};

const RiskStats: React.FC<RiskStatsProps> = ({ risks, loading = false }) => {
  const stats = useMemo(() => {
    const total = risks.length;
    const highCriticalCount = risks.filter(
      (risk) => risk.level === 'High' || risk.level === 'Critical'
    ).length;
    const averageScore = total > 0
      ? (risks.reduce((sum, risk) => sum + risk.score, 0) / total).toFixed(1)
      : '0.0';

    return {
      total,
      highCriticalCount,
      averageScore,
    };
  }, [risks]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="skeleton h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Total Risks"
        value={stats.total}
        subtitle="Assessed risks"
        icon={<BarChart3 className="w-6 h-6" />}
        color="blue"
      />
      <StatCard
        title="High/Critical Risks"
        value={stats.highCriticalCount}
        subtitle={stats.total > 0 ? `${((stats.highCriticalCount / stats.total) * 100).toFixed(0)}% of total` : 'No risks yet'}
        icon={<AlertTriangle className="w-6 h-6" />}
        color="orange"
      />
      <StatCard
        title="Average Score"
        value={stats.averageScore}
        subtitle="Out of 25"
        icon={<Target className="w-6 h-6" />}
        color="green"
      />
    </div>
  );
};

export default RiskStats;
