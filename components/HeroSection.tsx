"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LampContainer } from "./lamp";
import { Download, Mail, Phone, Github, Linkedin } from "lucide-react";
import { ProjectLibraryModal } from "./ProjectLibraryModal";
import { ProjectModal } from "./ProjectModal";

export function HeroSection() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // 简历下载功能
  const handleResumeDownload = () => {
    const resumeUrl = "https://file-sun.oss-cn-beijing.aliyuncs.com/yang/Web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91-%E6%9D%A8%E6%81%92%E5%88%A9%E7%AE%80%E5%8E%86.pdf";
    
    // 创建一个临时的a标签来触发下载
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Web前端开发-杨恒利简历.pdf'; // 设置下载文件名
    link.target = '_blank'; // 在新标签页打开，避免跨域问题
    
    // 将链接添加到DOM，点击后移除
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 打开项目库
  const handleProjectsOpen = () => {
    setIsLibraryOpen(true);
  };

  // 关闭项目库
  const handleLibraryClose = () => {
    setIsLibraryOpen(false);
    // 同时关闭项目详情（如果打开）
    setIsProjectModalOpen(false);
    setSelectedProject(null);
  };

  // 从项目库选择项目查看详情
  const handleLibraryProjectSelect = (project: any) => {
    console.log('HeroSection: 接收到项目选择', project.title);
    setSelectedProject(project);
    setIsProjectModalOpen(true);
    console.log('HeroSection: 状态已更新', { selectedProject: project.title, isProjectModalOpen: true });
    // 项目库保持打开状态，不关闭
  };

  // 关闭项目详情
  const handleProjectModalClose = () => {
    setIsProjectModalOpen(false);
    setSelectedProject(null);
    // 项目库保持打开状态，不做任何改变
  };

  return (
    <>
      <LampContainer>
        <div className="relative z-50 flex translate-y-16 md:translate-y-8 lg:translate-y-16 flex-col items-center px-5 pt-12 md:pt-16 lg:pt-20">
          {/* 个人头像 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mb-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1"
          >
            <div className="rounded-full bg-slate-950 p-2">
              <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-transparent bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5">
                <img 
                  src="/images/avatar.jpg" 
                  alt="杨恒利个人头像" 
                  className="w-full h-full rounded-full object-cover bg-slate-950"
                  onError={(e) => {
                    // 如果图片加载失败，显示备用文字
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-6xl font-bold">
                        杨
                      </div>
                    `;
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* 主标题 - 价值主张 */}
          <motion.h1
            initial={{ opacity: 0.5, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
          >
            你好，我是杨恒利
          </motion.h1>

          {/* 副标题 - 专业定位 */}
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-4 text-xl md:text-2xl text-slate-400 text-center max-w-4xl"
          >
            一个专注于前端开发和可视化技术的工程师，致力于通过技术创新解决实际业务问题
          </motion.h2>

          {/* 核心能力标签 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-sm md:text-base"
          >
            {[
              "React/Vue 开发",
              "数据可视化",
              "地图应用开发", 
              "微信小程序",
              "无人机控制系统",
              "9年工作经验"
            ].map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-300 backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </motion.div>

          {/* 联系信息 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.9,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-8 flex flex-wrap justify-center gap-4 text-slate-400"
          >
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>13834738983</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>13834738983@163.com</span>
            </div>
          </motion.div>

          {/* CTA 按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.1,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={handleProjectsOpen}
              className="group relative px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
            >
              <span>查看我的项目</span>
              <motion.div
                className="w-0 h-0.5 bg-white/30"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </button>
            
            <button 
              onClick={handleResumeDownload}
              className="group px-8 py-3 border border-cyan-500/30 rounded-lg text-cyan-300 font-medium hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-2"
            >
              <Download className="h-4 w-4 group-hover:animate-bounce" />
              <span>下载简历</span>
            </button>
          </motion.div>
        </div>
      </LampContainer>

      {/* 项目库模态框 - z-index: 50 */}
      <ProjectLibraryModal
        isOpen={isLibraryOpen}
        onClose={handleLibraryClose}
        onProjectSelect={handleLibraryProjectSelect}
      />

      {/* 项目详情模态框 - z-index: 60 */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={handleProjectModalClose}
        project={selectedProject}
      />
    </>
  );
} 