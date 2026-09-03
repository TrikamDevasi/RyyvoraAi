'use client';

import React from 'react';
import SkillSenseIntro from './SkillSenseIntro';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  return <SkillSenseIntro>{children}</SkillSenseIntro>;
}
