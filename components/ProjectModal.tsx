"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, TrendingUp, Award } from "lucide-react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    image: string;
    role: string;
    technologies: string[];
    achievements: string[];
    highlights: string;
    category: string;
    timeline?: string;
    teamSize?: string;
    challenges?: string[];
    solutions?: string[];
    results?: string[];
  } | null;
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  console.log('ProjectModal 渲染状态:', { isOpen, project: project?.title || 'null' });
  
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 - z-index: 9999 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            style={{ zIndex: 9999 }}
          />
          
          {/* 模态框内容 - z-index: 9999 */}
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              {/* 滚动内容区域 */}
              <div className="overflow-y-auto max-h-[90vh]">
                {/* 头部区域 */}
                <div className="relative p-8 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-slate-700">
                  <div className="flex items-start gap-6">
                    <div className="text-8xl">{project.image}</div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-white mb-3">
                        {project.title}
                      </h2>
                      <p className="text-slate-300 text-lg mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                          {project.category}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-400">{project.role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 主要内容 */}
                <div className="p-8 space-y-8">
                  {/* 项目信息网格 */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {project.timeline && (
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm font-medium text-cyan-400">项目周期</span>
                        </div>
                        <p className="text-slate-300">{project.timeline}</p>
                      </div>
                    )}
                    
                    {project.teamSize && (
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm font-medium text-cyan-400">团队规模</span>
                        </div>
                        <p className="text-slate-300">{project.teamSize}</p>
                      </div>
                    )}
                  </div>

                  {/* 技术栈 */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                      技术栈
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg border border-slate-600 hover:border-cyan-500/50 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 项目亮点 */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-cyan-400" />
                      项目亮点
                    </h3>
                    <p className="text-slate-300 text-lg italic bg-gradient-to-r from-cyan-500/10 to-blue-600/10 p-4 rounded-lg border border-cyan-500/20">
                      {project.highlights}
                    </p>
                  </div>

                  {/* 核心成就 */}
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">核心成就</h3>
                    <div className="grid gap-3">
                      {project.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 技术挑战 */}
                  {project.challenges && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">技术挑战</h3>
                      <div className="grid gap-3">
                        {project.challenges.map((challenge, index) => (
                          <div key={index} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-slate-300">{challenge}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 解决方案 */}
                  {project.solutions && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">解决方案</h3>
                      <div className="grid gap-3">
                        {project.solutions.map((solution, index) => (
                          <div key={index} className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <p className="text-slate-300">{solution}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 项目成果 */}
                  {project.results && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">项目成果</h3>
                      <div className="grid gap-3">
                        {project.results.map((result, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-lg border border-cyan-500/20">
                            <TrendingUp className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>


              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
} 