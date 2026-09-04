'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { SkillGapAnalysis } from '../../types/charts';
import { CHART_THEMES } from '../../lib/chartColors';

interface Props {
  data: SkillGapAnalysis[];
}

const theme = CHART_THEMES.dark;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: 'var(--bg-surface, #111827)',
          border: '1px solid var(--border-default, rgba(255,255,255,0.10))',
          borderRadius: 8,
          padding: '10px 14px',
          boxShadow: 'var(--shadow-md)',
          minWidth: '160px',
        }}
      >
        <p
          style={{
            color: 'var(--brand-gold, #F59E0B)',
            fontWeight: 700,
            fontSize: 12.5,
            marginBottom: 6,
          }}
        >
          {label}
        </p>
        {payload.map((entry: any, i: number) => (
          <p
            key={i}
            style={{
              color: entry.name === 'My Level' ? 'var(--brand-gold, #F59E0B)' : 'var(--brand-navy-light, #3B82F6)',
              margin: '2px 0',
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            {entry.name}: <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SkillGapRadar({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-surface)',
          borderRadius: 8,
          border: '1px dashed var(--border-default)',
          color: 'var(--text-muted)',
          fontSize: 13,
        }}
      >
        No competency radar data available
      </div>
    );
  }

  const hasStudentScore = data.some((d) => d.studentScore !== undefined);
  const myLevelKey = hasStudentScore ? 'studentScore' : 'myLevel';
  const hasMarketBenchmark = data.some((d) => d.marketBenchmark !== undefined);
  const targetBenchmarkKey = hasMarketBenchmark ? 'marketBenchmark' : 'industryReq';

  // Sanitize labels to avoid clipping
  const formattedData = data.map((d) => ({
    ...d,
    shortSkill: (d.skill || '').length > 16 ? `${(d.skill || '').slice(0, 15)}…` : (d.skill || ''),
    [myLevelKey]: d.studentScore ?? d.myLevel ?? 0,
    [targetBenchmarkKey]: d.marketBenchmark ?? d.industryReq ?? 0,
  }));

  return (
    <div style={{ width: '100%', height: 320, minHeight: 280, position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={formattedData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="var(--border-subtle, rgba(255,255,255,0.06))" />
          <PolarAngleAxis
            dataKey="shortSkill"
            tick={{ fill: 'var(--text-secondary, #94A3B8)', fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: 'var(--text-muted, #64748B)', fontSize: 9.5 }}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8, color: 'var(--text-secondary, #94A3B8)' }}
            iconType="circle"
          />
          <Radar
            name="My Level"
            dataKey={myLevelKey}
            stroke={theme.series.primary}
            fill={theme.series.primary}
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Institutional Benchmark"
            dataKey={targetBenchmarkKey}
            stroke={theme.series.benchmark}
            fill={theme.series.benchmark}
            fillOpacity={0.15}
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
