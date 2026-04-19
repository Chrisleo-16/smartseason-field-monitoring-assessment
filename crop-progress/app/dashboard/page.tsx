"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard by default
    router.push('/dashboard/admin');
  }, [router]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Loading Dashboard...</h1>
      <p>Redirecting to admin dashboard...</p>
    </div>
  );
}
