"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Play, TrendingUp, Users, Award } from "lucide-react";
import { ProjectModal } from "./ProjectModal";

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };
  const projects = [
    {
      title: "灵雀无人机巡航系统",
      description: "基于大疆无人机设备开发的智能巡航项目，实现无人机远程控制、航线规划、实时监控等功能",
      image: "🚁",
      role: "前端技术负责人",
      technologies: ["React", "Mapbox", "WebSocket", "Jotai", "TypeScript"],
      achievements: [
        "完成无人机巡航、镜头控制、飞行控制等核心功能",
        "实现一键起飞、指点、环绕飞行等智能操作",
        "开发地图航线、半径、轨迹、点位等可视化功能",
        "构建任务管理、航线管理、设备管理完整系统"
      ],
      highlights: "实时无人机控制 | 智能巡航系统 | 地图可视化",
      category: "物联网 & 地图技术",
      timeline: "2024年1月 - 至今",
      teamSize: "5人前端团队",
      challenges: [
        "实时性要求：无人机控制指令需要毫秒级响应",
        "地图性能：大量轨迹点位的渲染优化",
        "设备兼容：适配多种型号的大疆无人机",
        "网络稳定：处理弱网环境下的数据传输"
      ],
      solutions: [
        "采用WebSocket建立持久连接，实现实时通信",
        "使用Mapbox GL JS的聚合渲染技术",
        "抽象设备接口层，统一不同设备的API",
        "实现断线重连和数据缓存机制"
      ],
      results: [
        "系统稳定性达到99.9%，支持同时控制10架无人机",
        "地图渲染性能提升300%，支持10万+轨迹点实时显示",
        "用户操作响应时间降低至100ms以内",
        "成功应用于安防巡逻、物流配送等多个场景"
      ]
    },
    {
      title: "灵思地图数据平台",
      description: "面向POI、设备、事件的数据展示平台，提供多维度数据可视化和实时监控能力",
      image: "🗺️",
      role: "前端架构师",
      technologies: ["React", "Mapbox", "VChart", "WebGL", "Jotai"],
      achievements: [
        "开发AOI、POI、设备列表和点位展示功能",
        "实现事件引擎中网格点、聚合点可视化",
        "构建人员、车辆活动轨迹追踪系统",
        "封装可复用的地图组件库"
      ],
      highlights: "数据可视化 | 实时监控 | 地图引擎",
      category: "数据可视化",
      timeline: "2023年6月 - 2024年3月",
      teamSize: "3人前端团队",
      challenges: [
        "海量数据渲染：百万级POI点位的性能优化",
        "实时更新：设备状态和事件数据的实时同步",
        "复杂查询：多维度筛选和空间查询功能",
        "用户体验：大数据量下的流畅交互"
      ],
      solutions: [
        "采用分层加载和聚合显示策略",
        "实现WebSocket + 增量更新机制",
        "使用空间索引优化查询性能",
        "虚拟滚动和懒加载提升列表性能"
      ],
      results: [
        "支持同时显示100万+POI点位，渲染性能提升500%",
        "实时数据更新延迟控制在500ms以内",
        "用户查询响应时间平均200ms，满足快速检索需求",
        "组件库被团队多个项目复用，开发效率提升60%"
      ]
    },
    {
      title: "鲸准外教批改系统",
      description: "中外教老师对学生作业和模考的智能批改平台，集成AI判分和多媒体评测功能",
      image: "📚",
      role: "前端开发工程师",
      technologies: ["React", "Redux", "WebRTC", "WebSocket", "CustomCra"],
      achievements: [
        "搭建IELTS、TOEFL学生端模考系统",
        "封装单选、多选、填空、拖拽、口语等题型组件",
        "集成音频数据收集和实时波形显示",
        "实现真人模拟口语考试功能"
      ],
      highlights: "教育科技 | AI评分 | 音视频处理",
      category: "教育技术",
      timeline: "2020年3月 - 2022年1月",
      teamSize: "6人开发团队",
      challenges: [
        "音频处理：实时音频采集和波形可视化",
        "AI集成：口语评分算法的前端集成",
        "题型复杂：多种考试题型的统一组件化",
        "实时交互：师生在线批改的实时通信"
      ],
      solutions: [
        "使用Web Audio API实现音频处理和波形展示",
        "封装AI评分接口，实现前端缓存和降级策略",
        "设计可复用的题型组件库和配置化系统",
        "基于WebSocket实现实时消息和状态同步"
      ],
      results: [
        "支持20+种考试题型，组件复用率达到80%",
        "音频采集成功率99%，AI评分准确率90%+",
        "系统服务10万+学生，日活跃用户5000+",
        "批改效率提升70%，老师工作量显著减少"
      ]
    },
    {
      title: "鲸小爱背单词小程序",
      description: "基于艾宾浩斯记忆曲线的智能背单词应用，帮助用户高效记忆单词",
      image: "📱",
      role: "独立开发者",
      technologies: ["mpvue", "小程序", "云开发", "AI算法"],
      achievements: [
        "实现自定义单词集创建功能",
        "基于艾宾浩斯记忆曲线优化学习路径",
        "开发音视频播放和手写识别功能",
        "集成微信生态权限和分享功能"
      ],
      highlights: "小程序开发 | 学习算法 | 用户增长",
      category: "移动应用",
      timeline: "2019年8月 - 2020年6月",
      teamSize: "独立开发",
      challenges: [
        "记忆算法：艾宾浩斯遗忘曲线的算法实现",
        "小程序限制：存储和性能的限制处理",
        "用户留存：如何提升长期学习的用户粘性",
        "内容管理：海量单词和例句的数据组织"
      ],
      solutions: [
        "实现智能复习提醒和个性化学习计划",
        "使用云开发优化数据存储和同步",
        "设计游戏化学习和社交分享机制",
        "构建分级单词库和智能推荐系统"
      ],
      results: [
        "用户平均学习时长提升40%，记忆效果显著改善",
        "小程序获得5万+用户，4.8分好评率",
        "日活跃率达到25%，月留存率超过60%",
        "分享传播率15%，用户自发推荐成为主要增长途径"
      ]
    }
  ];

  return (
    <section className="relative py-20 bg-slate-950">
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
            精选项目
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            用结果说话，展示我在不同技术领域的实践成果和业务价值创造
          </p>
        </motion.div>

        {/* 项目网格 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500"
            >
              {/* 项目头部 */}
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{project.image}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                          {project.category}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-400">{project.role}</span>
                      </div>
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink className="h-5 w-5 text-cyan-400" />
                  </button>
                </div>

                <p className="text-slate-300 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* 亮点展示 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-400">项目亮点</span>
                  </div>
                  <p className="text-sm text-slate-400 italic">
                    {project.highlights}
                  </p>
                </div>

                {/* 技术栈 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-slate-400">技术栈</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 text-xs bg-slate-700/50 text-slate-300 rounded border border-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 核心成就 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-400">核心成就</span>
                  </div>
                  <ul className="space-y-2">
                    {project.achievements.slice(0, 3).map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start gap-2 text-sm text-slate-300">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                  <button 
                    onClick={() => handleProjectClick(project)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4" />
                    查看详情
                  </button>
                  <button className="px-4 py-2 border border-slate-600 text-slate-300 text-sm font-medium rounded-lg hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300">
                    技术分析
                  </button>
                </div>
              </div>

              {/* 渐变边框效果 */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        {/* 查看更多项目 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-xl text-cyan-300 font-medium hover:from-cyan-500/20 hover:to-blue-600/20 transition-all duration-300">
            <span className="flex items-center gap-2">
              查看完整项目库
              <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>
      </div>

      {/* 项目详情模态框 */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        project={selectedProject}
      />
    </section>
  );
} 