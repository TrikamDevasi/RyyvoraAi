export default function StudentLoading() {
    return (
        <div>
            <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:.25} }`}</style>
            {/* Welcome banner skeleton */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, height: 100, animation: 'pulse 1.4s ease infinite' }} />
            {/* Tabs skeleton */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} style={{ width: 80, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.4s ease infinite' }} />
                ))}
            </div>
            {/* Cards skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[1,2,3,4].map(i => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '18px 16px', height: 90, animation: 'pulse 1.4s ease infinite' }} />
                ))}
            </div>
            {/* Charts skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                {[1,2].map(i => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px', height: 280, animation: 'pulse 1.4s ease infinite' }} />
                ))}
            </div>
        </div>
    );
}
