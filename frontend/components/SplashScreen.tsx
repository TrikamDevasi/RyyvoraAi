'use client';

import React from 'react';
import RyyvoraIntro from './RyyvoraIntro';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  return <RyyvoraIntro>{children}</RyyvoraIntro>;
}
