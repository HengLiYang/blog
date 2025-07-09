"use client";
import React from "react";
import { motion } from "framer-motion";
import { Code, Database, Map, Smartphone, Drone, TrendingUp } from "lucide-react";

export function AboutSection() {
  const competencies = [
    {
      icon: <Code className="h-6 w-6" />,
      title: "前端架构",
      skills: ["React/Vue", "TypeScript", "Webpack/Vite", "微前端"],
      description: "精通现代前端框架和工程化技术"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "数据可视化",
      skills: ["Echarts", "D3.js", "Three.js", "WebGL"],
      description: "专业的数据展示和交互式可视化开发"
    },
    {
      icon: <Map className="h-6 w-6" />,
      title: "地图技术",
      skills: ["Mapbox", "高德地图", "WebGIS", "空间分析"],
      description: "丰富的地图应用和地理信息系统开发经验"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "移动开发",
      skills: ["微信小程序", "Taro", "响应式设计", "PWA"],
      description: "跨平台移动应用开发和优化"
    }
  ];

  const philosophy = [
    {
      title: "技术驱动业务",
      description: "我坚信最好的产品源于对业务问题的深刻理解，通过技术手段提供优雅的解决方案。"
    },
    {
      title: "用户体验至上",
      description: "每一行代码都应该为用户创造价值，注重交互细节和性能优化。"
    },
    {
      title: "持续学习成长",
      description: "技术日新月异，保持学习热情，关注前沿技术，将新技术应用到实际项目中。"
    }
  ];

  return (
    <section className="relative py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-6">
            关于我
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            9年前端开发经验，专注于可视化技术和复杂业务场景的技术解决方案
          </p>
        </motion.div>

        {/* 产品理念 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">我的技术理念</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {philosophy.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700"
              >
                <h4 className="text-lg font-semibold text-cyan-400 mb-3">
                  {item.title}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 我的故事 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-20 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-2xl p-8 border border-cyan-500/20"
        >
          <h3 className="text-2xl font-bold text-white mb-6">我的成长故事</h3>
          <div className="prose prose-lg text-slate-300 max-w-none">
            <p className="mb-4">
              从2015年开始我的前端开发之路，见证了前端技术的快速发展。从最初的jQuery时代，
              到现在的React、Vue生态，我始终保持着对新技术的敏感度和学习热情。
            </p>
            <p className="mb-4">
              在北京升哲科技的工作经历让我深入接触物联网和可视化技术，开发了灵雀无人机巡航系统
              和灵思地图平台，这些项目让我在地图技术、实时数据处理和复杂交互方面积累了丰富经验。
            </p>
            <p>
              我相信技术的价值在于解决实际问题，每个项目都是一次技术能力的提升和业务理解的深化。
            </p>
          </div>
        </motion.div>

        {/* 核心能力矩阵 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-12 text-center">核心能力矩阵</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competencies.map((comp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {comp.icon}
                  </div>
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {comp.title}
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                  {comp.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {comp.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 工作成就统计 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "9+", label: "年工作经验" },
            { number: "4", label: "家知名公司" },
            { number: "10+", label: "个核心项目" },
            { number: "5", label: "个技术领域" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-slate-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 