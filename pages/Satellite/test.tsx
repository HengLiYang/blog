"use client";
import React, { useRef } from 'react';
import SceneProvider from './components/SceneProvider';
import SatelliteScene from './components/SatelliteScene';

export default function SatelliteTestPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    const testSatellites = [
        {
            id: 'test-satellite-1',
            name: '测试卫星1',
            model: '/models/satellite.glb',
            position: [5, 0, 0] as [number, number, number],
            description: '测试卫星'
        },
        {
            id: 'test-satellite-2',
            name: '测试卫星2',
            model: '/models/satellite-demo01.glb',
            position: [-5, 0, 0] as [number, number, number],
            description: '测试卫星'
        }
    ];

    const handleSatelliteClick = (satelliteId: string) => {
        console.log('点击了卫星:', satelliteId);
        alert(`点击了卫星: ${satelliteId}`);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
            <SceneProvider containerRef={containerRef}>
                <SatelliteScene
                    satellites={testSatellites}
                    onSatelliteClick={handleSatelliteClick}
                    containerRef={containerRef}
                />
            </SceneProvider>
        </div>
    );
} 