'use client';

import React from 'react';
import SkillSenseLoader from './SkillSenseLoader';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  return <SkillSenseLoader>{children}</SkillSenseLoader>;
}
