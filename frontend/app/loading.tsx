'use client';

import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div style={{ 
            height: '100vh', 
            width: '100vw', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: '#08060f',
            zIndex: 9999
        }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '2px solid rgba(212,168,67,0.1)',
                        borderTopColor: '#D4A843'
                    }}
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: 20,
                        height: 20,
                        background: '#D4A843',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: '0 0 20px rgba(212,168,67,0.5)'
                    }}
                />
            </div>
        </div>
    );
}
