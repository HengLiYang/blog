"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Layers, 
  Palette, 
  Database, 
  BarChart3, 
  GitBranch, 
  Zap,
  Smartphone,
  Server,
  Monitor,
  Cpu,
  Star,
  Award,
  Brain
} from "lucide-react";

export function SkillsSection() {
  const [selectedCategory, setSelectedCategory] = useState("全部");

  // 扁平化的技能数据，按熟练度分级
  const allSkills = [
    // 专家级 (90%+)
    { name: "HTML5", level: 95, years: "9年", category: "前端基础", priority: "expert" },
    { name: "CSS3", level: 95, years: "9年", category: "前端基础", priority: "expert" },
    { name: "JavaScript", level: 95, years: "9年", category: "前端基础", priority: "expert" },
    { name: "React", level: 95, years: "6年", category: "前端框架", priority: "expert" },
    { name: "Echarts", level: 95, years: "7年", category: "数据可视化", priority: "expert" },
    { name: "Ajax", level: 95, years: "9年", category: "数据交互", priority: "expert" },
    { name: "Git", level: 95, years: "9年", category: "开发工具", priority: "expert" },
    { name: "ES6+", level: 95, years: "7年", category: "现代技术", priority: "expert" },
    
    // 熟练级 (80-89%)
    { name: "Vue", level: 90, years: "7年", category: "前端框架", priority: "advanced" },
    { name: "React Hooks", level: 90, years: "4年", category: "前端框架", priority: "advanced" },
    { name: "Mapbox", level: 90, years: "4年", category: "数据可视化", priority: "advanced" },
    { name: "TypeScript", level: 90, years: "5年", category: "现代技术", priority: "advanced" },
    { name: "Ant Design", level: 90, years: "5年", category: "UI框架", priority: "advanced" },
    { name: "微信小程序", level: 90, years: "5年", category: "移动端开发", priority: "advanced" },
    { name: "Vite", level: 90, years: "3年", category: "构建工具", priority: "advanced" },
    { name: "RESTful API", level: 90, years: "8年", category: "数据交互", priority: "advanced" },
    { name: "Fetch API", level: 90, years: "6年", category: "数据交互", priority: "advanced" },
    { name: "npm/yarn/pnpm", level: 90, years: "8年", category: "开发工具", priority: "advanced" },
    
    // 中级+ (75-89%)
    { name: "Flexbox", level: 88, years: "8年", category: "前端基础", priority: "intermediate" },
    { name: "Element UI", level: 88, years: "6年", category: "UI框架", priority: "intermediate" },
    { name: "Redux", level: 85, years: "5年", category: "前端框架", priority: "intermediate" },
    { name: "Bootstrap", level: 85, years: "7年", category: "UI框架", priority: "intermediate" },
    { name: "VCharts", level: 85, years: "3年", category: "数据可视化", priority: "intermediate" },
    { name: "高德地图", level: 85, years: "5年", category: "数据可视化", priority: "intermediate" },
    { name: "Webpack", level: 85, years: "6年", category: "构建工具", priority: "intermediate" },
    { name: "WebSocket", level: 85, years: "4年", category: "数据交互", priority: "intermediate" },
    { name: "mpvue", level: 85, years: "4年", category: "移动端开发", priority: "intermediate" },
    { name: "Taro", level: 85, years: "3年", category: "移动端开发", priority: "intermediate" },
    { name: "ESLint", level: 85, years: "6年", category: "开发工具", priority: "intermediate" },
    { name: "Prettier", level: 85, years: "5年", category: "开发工具", priority: "intermediate" },
    { name: "Tailwind CSS", level: 85, years: "3年", category: "UI框架", priority: "intermediate" },
    
    // 中级 (70-84%)
    { name: "D3.js", level: 80, years: "3年", category: "数据可视化", priority: "intermediate" },
    { name: "Jotai", level: 80, years: "2年", category: "前端框架", priority: "intermediate" },
    { name: "Mint UI", level: 80, years: "4年", category: "UI框架", priority: "intermediate" },
    { name: "Umi", level: 80, years: "3年", category: "构建工具", priority: "intermediate" },
    { name: "Storybook", level: 80, years: "2年", category: "开发工具", priority: "intermediate" },
    { name: "微前端", level: 80, years: "2年", category: "现代技术", priority: "intermediate" },
    { name: "Node.js", level: 80, years: "5年", category: "后端技术", priority: "intermediate" },
    
         // AI技术
     { name: "COZE", level: 88, years: "2年", category: "AI技术", priority: "advanced" },
     { name: "DIFY", level: 85, years: "1年", category: "AI技术", priority: "advanced" },
     { name: "MCP", level: 80, years: "1年", category: "AI技术", priority: "intermediate" },
     
     // 基础+ (70-79%)
     { name: "Gulp", level: 75, years: "5年", category: "构建工具", priority: "basic" },
     { name: "Rollup", level: 75, years: "2年", category: "构建工具", priority: "basic" },
     { name: "PWA", level: 75, years: "3年", category: "移动端开发", priority: "basic" },
     { name: "ServiceWorker", level: 75, years: "3年", category: "现代技术", priority: "basic" },
     { name: "Koa", level: 75, years: "3年", category: "后端技术", priority: "basic" },
     { name: "Express", level: 70, years: "4年", category: "后端技术", priority: "basic" }
   ];

  const categories = ["全部", "前端基础", "前端框架", "UI框架", "数据可视化", "数据交互", "构建工具", "移动端开发", "开发工具", "现代技术", "AI技术", "后端技术"];

  const filteredSkills = selectedCategory === "全部" 
    ? allSkills 
    : allSkills.filter(skill => skill.category === selectedCategory);

  const getSkillStyle = (skill: any) => {
    const baseClasses = "inline-block px-4 py-2 m-1 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer border";
    
    // AI技术特殊样式
    if (skill.category === "AI技术") {
      if (skill.priority === "advanced") {
        return `${baseClasses} bg-gradient-to-r from-orange-500/80 to-amber-600/80 text-white border-orange-400 hover:shadow-lg hover:shadow-orange-500/25`;
      } else if (skill.priority === "intermediate") {
        return `${baseClasses} bg-gradient-to-r from-orange-500/60 to-amber-600/60 text-white border-orange-400 hover:shadow-lg hover:shadow-orange-500/25`;
      }
    }
    
    switch (skill.priority) {
      case "expert":
        return `${baseClasses} bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 text-base font-bold`;
      case "advanced":
        return `${baseClasses} bg-gradient-to-r from-green-500/80 to-emerald-600/80 text-white border-green-400 hover:shadow-lg hover:shadow-green-500/25`;
      case "intermediate":
        return `${baseClasses} bg-gradient-to-r from-purple-500/60 to-pink-600/60 text-white border-purple-400 hover:shadow-lg hover:shadow-purple-500/25`;
      default:
        return `${baseClasses} bg-slate-700/50 text-slate-300 border-slate-600 hover:bg-slate-600/50 hover:text-white`;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "expert":
        return <Star className="h-4 w-4 text-yellow-400 fill-current" />;
      case "advanced":
        return <Award className="h-4 w-4 text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <section className="relative py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-600/10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-600/10 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              专业技能
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            基于9年前端开发经验，掌握全栈技术体系，专注于可视化和现代化前端解决方案
          </p>
          
          {/* 技能统计 */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{categories.length - 1}</div>
              <div className="text-sm text-slate-400">技能领域</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{allSkills.length}</div>
              <div className="text-sm text-slate-400">核心技能</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">9+</div>
              <div className="text-sm text-slate-400">年经验</div>
            </div>
          </div>
        </motion.div>

        {/* 技能等级说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-cyan-300 text-sm font-medium">专家级 (90%+)</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
            <Award className="h-4 w-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">熟练级 (85-89%)</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-600"></div>
            <span className="text-purple-300 text-sm font-medium">中级+ (75-84%)</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
            <Brain className="h-4 w-4 text-orange-400" />
            <span className="text-orange-300 text-sm font-medium">AI技术</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
            <div className="w-4 h-4 rounded-full bg-slate-600"></div>
            <span className="text-slate-300 text-sm font-medium">基础+ (70-79%)</span>
          </div>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-cyan-400"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* 技能标签云 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-block">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={`${skill.name}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className={getSkillStyle(skill)}
                title={`${skill.name} - 熟练度: ${skill.level}% | 经验: ${skill.years}`}
              >
                <div className="flex items-center gap-2">
                  {getPriorityIcon(skill.priority)}
                  <span>{skill.name}</span>
                  <span className="text-xs opacity-75">({skill.level}%)</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 技能总结 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-full border border-cyan-500/30">
            <Monitor className="h-5 w-5 text-cyan-400" />
            <span className="text-cyan-300 font-medium">
              持续学习新技术，保持技能栈的现代化和竞争力
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 