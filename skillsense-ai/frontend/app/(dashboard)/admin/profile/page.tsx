'use client';

import React from 'react';
import { ProfileShell } from '@/components/profile/ProfileShell';

export default function AdminProfilePage() {
  return <ProfileShell forcedRole="admin" />;
}
