'use client';

import React from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { SkillGapEntry } from '../../types/charts';

interface Props {
  data: SkillGapEntry[];
}

const GOLD = '#F59E0B';
const WHITE = '#FFFFFF';
const MUTED = '#94a3b8';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div
        style={{
          background: 'rgba(15, 17, 26, 0.95)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '8px',
          padding: '10px 14px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          minWidth: '150px',
        }}
      >
        <p
          style={{
            color: '#F59E0B',
            fontWeight: 700,
            fontSize: '12px',
            marginBottom: '6px',
          }}
        >
          {label}
        </p>
        {payload.map((entry: any, i: number) => (
          <p
            key={i}
            style={{
              color: entry.name === 'My Level' ? '#F59E0B' : '#ffffff',
              margin: '2px 0',
              fontSize: '12px',
              fontWeight: 500,
            }}
          >
            {entry.name}: <span style={{ fontWeight: 700 }}>{entry.value}%</span>
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
          background: 'rgba(255,255,255,0.02)',
          borderRadius: 12,
          border: '1px dashed var(--border)',
          color: 'var(--text-muted)',
          fontSize: 13,
        }}
      >
        No competency radar data available
      </div>
    );
  }

  // Sanitize labels to avoid clipping
  const formattedData = data.map((d) => ({
    ...d,
    shortSkill: d.skill.length > 14 ? `${d.skill.slice(0, 13)}…` : d.skill,
  }));

  return (
    <div style={{ width: '100%', height: 320, minHeight: 280, position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={formattedData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="shortSkill"
            tick={{ fill: MUTED, fontSize: 10.5, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: MUTED, fontSize: 9 }}
            axisLine={false}
          />
          <Radar
            name="My Level"
            dataKey="myLevel"
            stroke={GOLD}
            fill={GOLD}
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ fill: GOLD, r: 3 }}
          />
          <Radar
            name="Industry Req"
            dataKey="industryReq"
            stroke="#60a5fa"
            fill="transparent"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={{ fill: '#60a5fa', r: 2 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ color: MUTED, fontSize: 11, paddingTop: 4 }}
            formatter={(value) => (
              <span style={{ color: value === 'My Level' ? GOLD : '#60a5fa', fontWeight: 600 }}>{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
