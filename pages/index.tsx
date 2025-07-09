"use client";
import React from "react";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { ProjectsSection } from "../components/ProjectsSection";
import { SkillsSection } from "../components/SkillsSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section - 第一屏价值主张 */}
      <HeroSection />
      
      {/* About Section - 关于我和技术理念 */}
      <AboutSection />
      
      {/* Projects Section - 精选项目展示 */}
      <ProjectsSection />
      
      {/* Skills Section - 专业技能展示 */}
      <SkillsSection />
      
      {/* Footer */}
      <footer className="relative py-12 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400 mb-4">
              © 2024 杨恒利. 一个专注于前端开发和可视化技术的工程师
            </p>
            <p className="text-sm text-slate-500">
              致力于通过技术创新解决实际业务问题，创造用户价值
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
} 