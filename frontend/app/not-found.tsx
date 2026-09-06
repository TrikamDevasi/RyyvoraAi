'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Custom404() {
    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#08060f',
            color: '#fff',
            fontFamily: 'Space Grotesk, sans-serif'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center' }}
            >
                <h1 style={{ fontSize: '120px', fontWeight: 900, marginBottom: 0, color: 'rgba(212,168,67,0.1)' }}>
                    404
                </h1>
                <div style={{ marginTop: -60 }}>
                    <h2 style={{ fontSize: '32px', marginBottom: 16 }}>Dimension Not Found</h2>
                    <p style={{ color: '#94a3b8', maxWidth: 400, margin: '0 auto 32px' }}>
                        The page you are looking for has been archived in the AI core or never existed in this timeline.
                    </p>
                    <Link href="/student" className="btn-primary" style={{ textDecoration: 'none' }}>
                        Return to Hub
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
