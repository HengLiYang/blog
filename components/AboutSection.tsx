"use client";
import React from "react";
import { motion } from "framer-motion";
import { Code, Database, Map, Smartphone, TrendingUp } from "lucide-react";

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
            <p className="mb-6">
              <strong className="text-cyan-400">【物联网可视化专家 · 2022至今】</strong><br/>
              目前在升哲科技负责物联网感知数据的地图可视化方向，开发了灵雀无人机巡航系统
              和灵思地图平台。这些前沿项目让我在Mapbox地图技术、实时数据处理、
              WebSocket通信、大数据可视化等技术领域积累了丰富的实战经验，
              成为了可视化技术的专业工程师。
            </p>
            <p className="mb-6">
              <strong className="text-purple-400">【教育科技深耕 · 2020-2022】</strong><br/>
              在鲸航科技专注出国留学教育产品，深度参与需求分析和产品设计。
              开发了鲸准外教批改系统和鲸小爱背单词小程序，在React生态、
              音视频处理、AI集成等技术领域取得突破。这段经历让我理解了
              复杂业务场景下的技术挑战和解决思路。
            </p>
            <p className="mb-6">
              <strong className="text-green-400">【架构思维养成 · 2018-2020】</strong><br/>
              在智慧图科技期间，开始接触现代前端框架Vue，逐步承担前端架构设计责任。
              这个阶段让我从纯粹的功能实现者转变为解决方案设计者，在交互体验和产品设计方面
              形成了自己的见解，学会了如何平衡技术选型与业务需求。
            </p>
            <p className="mb-4">
              <strong className="text-blue-400">【金融科技起点 · 2015-2017】</strong><br/>
              在展恒基金开始前端开发之路，从jQuery + Bootstrap的传统开发模式入手，
              负责后台管理系统和数据监控页面构建。这段经历让我深入理解了用户交互行为分析、
              数据处理优化，以及与后端的协作模式。同时独立完成微信公众号开发，
              为后续的技术成长奠定了坚实基础。
            </p>
            <p className="text-slate-400 italic">
              <TrendingUp className="inline h-5 w-5 mr-2" />
              9年技术路径：从传统Web开发到现代前端架构，从业务实现到技术创新，
              每一段经历都是技术能力的跃升和视野的拓展。
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