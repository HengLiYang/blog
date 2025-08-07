"use client";
import React, { useState, useRef } from 'react';
import SceneProvider from './components/SceneProvider';
import SatelliteScene from './components/SatelliteScene';

export default function SatellitePage() {
  const [selectedSatellite, setSelectedSatellite] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const satellites = [
    {
      id: 'satellite-1',
      name: '高分一号',
      model: '/models/satellite.glb',
      position: [0, 0, 0] as [number, number, number], // 中心位置
      description: '高分辨率光学遥感卫星，主要用于国土资源调查、环境监测等'
    },
    {
      id: 'satellite-2',
      name: '高分二号',
      model: '/models/0.75m.glb',
      position: [0, 0, 0] as [number, number, number], // 中心位置
      description: '亚米级光学遥感卫星，具备高分辨率、宽覆盖能力'
    },
    {
      id: 'satellite-3',
      name: '高分三号',
      model: '/models/base_satellite.glb',
      position: [0, 0, 0] as [number, number, number], // 中心位置
      description: 'C波段合成孔径雷达卫星，全天候、全天时对地观测'
    },
    {
      id: 'satellite-4',
      name: '北斗导航卫星',
      model: '/models/base_satellite_demo01.glb',
      position: [0, 0, 0] as [number, number, number], // 向右偏移以居中
      description: '中国北斗卫星导航系统的重要组成部分，提供全球定位服务'
    },
    {
      id: 'satellite-5',
      name: '气象卫星',
      model: '/models/base_satellite_low.glb',
      position: [0, 0, 0] as [number, number, number], // 中心位置
      description: '气象观测卫星，用于天气预报和气候监测'
    }
  ];

  // 获取当前选中的卫星信息，如果没有选中则返回null
  const currentSatellite = selectedSatellite ? satellites.find(s => s.id === selectedSatellite) || null : null;
  return (
    <>
      <div className="satellite-page">
        {/* 控制面板 */}
        <div className="control-panel">
          <div className="panel-header">
            <h2>卫星3D展示系统</h2>
            <p className="text-slate-300 text-sm mt-2">
              基于 React Three Fiber 和 Three.js 的3D可视化技术展示
            </p>
          </div>

          <div className="satellite-list">
            <div className="satellite-list-header">
              <h3>卫星列表</h3>
              {selectedSatellite && (
                <button
                  className="return-to-earth-btn"
                  onClick={() => setSelectedSatellite('')}
                >
                  🌍 返回地球
                </button>
              )}
            </div>
            {satellites.map(satellite => (
              <div
                key={satellite.id}
                className={`satellite-item ${selectedSatellite === satellite.id ? 'selected' : ''}`}
                onClick={() => setSelectedSatellite(satellite.id)}
              >
                <div className="satellite-icon">🛰️</div>
                <div className="satellite-info">
                  <h4>{satellite.name}</h4>
                  <p>{satellite.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 只在选中卫星时显示卫星信息 */}
          {currentSatellite && (
            <SatelliteInfo
              satellite={currentSatellite}
              onClose={() => { }} // 不需要关闭功能
            />
          )}
        </div>

        {/* 3D 场景 */}
        <div className="scene-container" ref={containerRef}>
          <SceneProvider containerRef={containerRef}>
            <SatelliteScene
              selectedSatellite={currentSatellite}
            />
          </SceneProvider>
        </div>

        {/* 技能展示 */}
        <div className="skills-showcase">
          <div className="skill-card">
            <h3>Three.js</h3>
            <div className="skill-level">
              <div className="skill-bar" style={{ width: '85%' }}></div>
            </div>
            <p>3D图形渲染技术</p>
          </div>
          <div className="skill-card">
            <h3>React Three Fiber</h3>
            <div className="skill-level">
              <div className="skill-bar" style={{ width: '80%' }}></div>
            </div>
            <p>React 3D集成开发</p>
          </div>
          <div className="skill-card">
            <h3>TypeScript</h3>
            <div className="skill-level">
              <div className="skill-bar" style={{ width: '90%' }}></div>
            </div>
            <p>类型安全开发</p>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="back-button">
          <a href="/" className="back-link">
            ← 返回首页
          </a>
        </div>
      </div>
    </>
  );
}

function SatelliteInfo({ satellite, onClose }: { satellite: any; onClose: () => void }) {
  const satelliteDetails = {
    'satellite-1': {
      type: '光学遥感卫星',
      launchDate: '2013-04-26',
      orbit: '太阳同步轨道',
      altitude: '645km',
      resolution: '2m全色/8m多光谱',
      lifespan: '8年',
      status: '在轨运行'
    },
    'satellite-2': {
      type: '光学遥感卫星',
      launchDate: '2014-08-19',
      orbit: '太阳同步轨道',
      altitude: '631km',
      resolution: '0.8m全色/3.2m多光谱',
      lifespan: '8年',
      status: '在轨运行'
    },
    'satellite-3': {
      type: '雷达遥感卫星',
      launchDate: '2016-08-10',
      orbit: '太阳同步轨道',
      altitude: '755km',
      resolution: '1m',
      lifespan: '8年',
      status: '在轨运行'
    }
  };

  const details = satelliteDetails[satellite?.id as keyof typeof satelliteDetails] || {
    type: '未知',
    launchDate: '未知',
    orbit: '未知',
    altitude: '未知',
    resolution: '未知',
    lifespan: '未知',
    status: '未知'
  };

  if (!satellite) {
    return null;
  }

  return (
    <div className="satellite-info-panel">
      <div className="info-header">
        <h3>{satellite.name}</h3>
        <div className="header-buttons">
          <button onClick={onClose} className="close-btn">×</button>
        </div>
      </div>

      <div className="info-content">
        <div className="info-section">
          <h4>基本信息</h4>
          <div className="info-grid">
            <div className="info-item">
              <label>卫星ID:</label>
              <span>{satellite.id}</span>
            </div>
            <div className="info-item">
              <label>卫星类型:</label>
              <span>{details?.type}</span>
            </div>
            <div className="info-item">
              <label>发射日期:</label>
              <span>{details?.launchDate}</span>
            </div>
            <div className="info-item">
              <label>轨道类型:</label>
              <span>{details?.orbit}</span>
            </div>
            <div className="info-item">
              <label>轨道高度:</label>
              <span>{details?.altitude}</span>
            </div>
            <div className="info-item">
              <label>分辨率:</label>
              <span>{details?.resolution}</span>
            </div>
            <div className="info-item">
              <label>设计寿命:</label>
              <span>{details?.lifespan}</span>
            </div>
            <div className="info-item">
              <label>运行状态:</label>
              <span className="status-active">{details?.status}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h4>技术参数</h4>
          <div className="info-item">
            <label>模型文件:</label>
            <span className="file-path">{satellite.model}</span>
          </div>
          <div className="info-item">
            <label>当前位置:</label>
            <span>[{satellite.position.join(', ')}]</span>
          </div>
        </div>

        <div className="info-section">
          <h4>功能描述</h4>
          <p className="description">{satellite.description}</p>
        </div>
      </div>
    </div>
  );
}
