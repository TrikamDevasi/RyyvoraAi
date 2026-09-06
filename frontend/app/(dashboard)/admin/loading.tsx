export default function AdminLoading() {
    return (
        <div style={{ padding: '0 4px', maxWidth: 1100 }}>
            <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:.25} }`}</style>
            {/* Header skeleton */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ width: 260, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.4s ease infinite', marginBottom: 10 }} />
                <div style={{ width: 180, height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.4s ease infinite' }} />
            </div>
            {/* KPI cards skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                {[1,2,3,4].map(i => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 22px' }}>
                        <div style={{ width: '70%', height: 12, borderRadius: 4, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.4s ease infinite', marginBottom: 20 }} />
                        <div style={{ width: '50%', height: 32, borderRadius: 6, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.4s ease infinite' }} />
                    </div>
                ))}
            </div>
            {/* Chart row skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[1,2].map(i => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px', height: 220 }}>
                        <div style={{ width: 120, height: 14, borderRadius: 4, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.4s ease infinite', marginBottom: 24 }} />
                        <div style={{ width: '100%', height: 150, borderRadius: 8, background: 'rgba(255,255,255,0.04)', animation: 'pulse 1.4s ease infinite' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
