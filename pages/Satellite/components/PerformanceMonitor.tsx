import React, { useContext, useEffect, useState } from 'react';
import { SceneContext } from './SceneProvider';

interface PerformanceStats {
    fps: number;
    memory: {
        geometries: number;
        textures: number;
        triangles: number;
    };
    render: {
        calls: number;
        triangles: number;
        points: number;
        lines: number;
    };
}

const PerformanceMonitor: React.FC = () => {
    const { renderer, isInitialized } = useContext(SceneContext);
    const [stats, setStats] = useState<PerformanceStats>({
        fps: 0,
        memory: { geometries: 0, textures: 0, triangles: 0 },
        render: { calls: 0, triangles: 0, points: 0, lines: 0 }
    });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!renderer || !isInitialized) return;

        let frameCount = 0;
        let lastTime = performance.now();
        let animationId: number;

        const updateStats = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

                if (renderer) {
                    const info = renderer.info;
                    setStats({
                        fps,
                        memory: {
                            geometries: info.memory.geometries,
                            textures: info.memory.textures,
                            triangles: info.memory.triangles
                        },
                        render: {
                            calls: info.render.calls,
                            triangles: info.render.triangles,
                            points: info.render.points,
                            lines: info.render.lines
                        }
                    });
                }

                frameCount = 0;
                lastTime = currentTime;
            }

            animationId = requestAnimationFrame(updateStats);
        };

        updateStats();

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        };
    }, [renderer, isInitialized]);

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="performance-toggle"
                title="显示性能监控"
            >
                📊
            </button>
        );
    }

    return (
        <div className="performance-monitor">
            <div className="monitor-header">
                <h3>性能监控</h3>
                <button
                    onClick={() => setIsVisible(false)}
                    className="close-btn"
                >
                    ×
                </button>
            </div>

            <div className="monitor-content">
                <div className="stat-group">
                    <h4>帧率</h4>
                    <div className={`fps-display ${stats.fps < 30 ? 'warning' : stats.fps < 50 ? 'caution' : 'good'}`}>
                        {stats.fps} FPS
                    </div>
                </div>

                <div className="stat-group">
                    <h4>内存使用</h4>
                    <div className="stat-item">
                        <span>几何体:</span>
                        <span>{stats.memory.geometries}</span>
                    </div>
                    <div className="stat-item">
                        <span>纹理:</span>
                        <span>{stats.memory.textures}</span>
                    </div>
                    <div className="stat-item">
                        <span>三角形:</span>
                        <span>{stats.memory.triangles.toLocaleString()}</span>
                    </div>
                </div>

                <div className="stat-group">
                    <h4>渲染统计</h4>
                    <div className="stat-item">
                        <span>渲染调用:</span>
                        <span>{stats.render.calls}</span>
                    </div>
                    <div className="stat-item">
                        <span>渲染三角形:</span>
                        <span>{stats.render.triangles.toLocaleString()}</span>
                    </div>
                    <div className="stat-item">
                        <span>点:</span>
                        <span>{stats.render.points}</span>
                    </div>
                    <div className="stat-item">
                        <span>线:</span>
                        <span>{stats.render.lines}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceMonitor; 