import React from 'react';

function Particles() {
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${15 + Math.random() * 10}s`
    }));

    return (
        <div className="particles">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        top: p.top,
                        animationDelay: p.animationDelay,
                        animationDuration: p.animationDuration
                    }}
                />
            ))}
        </div>
    );
}

export default Particles;
