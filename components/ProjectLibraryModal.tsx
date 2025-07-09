"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, Calendar, Star, Filter } from "lucide-react";

interface ProjectLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectSelect: (project: any) => void;
}

export function ProjectLibraryModal({ isOpen, onClose, onProjectSelect }: ProjectLibraryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("全部");

  const allProjects = [
    // 主要项目（已在首页展示的）
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
      ],
      year: "2024",
      status: "进行中",
      featured: true
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
      ],
      year: "2023",
      status: "已完成",
      featured: true
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
      ],
      year: "2021",
      status: "已完成",
      featured: true
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
      ],
      year: "2020",
      status: "已完成",
      featured: true
    },

    // 其他项目
    {
      title: "瑞安物联网监控平台",
      description: "基于传感器和摄像头的智能监控系统，提供实时数据采集、分析和预警功能",
      image: "🏢",
      role: "前端开发工程师",
      technologies: ["Vue", "Element UI", "Echarts", "WebSocket", "百度地图API"],
      achievements: [
        "完成数据采集、监测、感知、分析等可视化展示",
        "实现权限管理、角色管理、场馆划分功能",
        "开发多维度数据图表和实时监控面板",
        "集成地图定位和区域管理功能"
      ],
      highlights: "物联网监控 | 数据可视化 | 实时预警",
      category: "物联网 & 地图技术",
      timeline: "2022年1月 - 2023年6月",
      teamSize: "4人开发团队",
      challenges: [
        "数据实时性：传感器数据的实时采集和展示",
        "系统稳定性：7x24小时不间断监控要求",
        "数据量大：海量传感器数据的处理和存储",
        "多终端适配：PC端和移动端的兼容性"
      ],
      solutions: [
        "采用WebSocket实现数据实时推送",
        "使用Vue响应式架构优化页面性能",
        "Echarts图表库实现多样化数据可视化",
        "Element UI确保界面一致性和响应式设计"
      ],
      results: [
        "监控系统覆盖200+个监测点，数据准确率99.5%",
        "告警响应时间控制在30秒内，提升安全效率",
        "系统稳定运行500+天，故障率低于0.1%",
        "为政府和企业提供智慧城市监控解决方案"
      ],
      year: "2023",
      status: "已完成",
      featured: false
    },
    {
      title: "客流分析系统",
      description: "分析用户行为、消费能力、进出场次数，提供客流统计和商业洞察",
      image: "📊",
      role: "前端开发工程师",
      technologies: ["React", "Ant Design", "Echarts", "D3.js", "Fetch API"],
      achievements: [
        "实现用户行为分析和消费能力评估模型",
        "开发进出场次数统计和客流密度分析",
        "构建复杂图表处理，包括天气、雷达图、关系图",
        "提供客流统计和商业洞察可视化报表"
      ],
      highlights: "用户行为分析 | 商业智能 | 可视化报表",
      category: "数据可视化",
      timeline: "2022年3月 - 2022年12月",
      teamSize: "5人开发团队",
      challenges: [
        "数据复杂性：多维度用户行为数据的关联分析",
        "实时计算：客流密度和消费预测的实时计算",
        "图表复杂：天气相关性和雷达图的特殊需求",
        "性能优化：大数据量下的图表渲染性能"
      ],
      solutions: [
        "采用React Hooks优化状态管理和计算逻辑",
        "使用Echarts和D3.js实现复杂数据可视化",
        "Ant Design确保界面的专业性和易用性",
        "实现数据缓存和分页加载提升性能"
      ],
      results: [
        "分析准确率达到85%，为商业决策提供数据支撑",
        "日处理客流数据10万+条，实时分析响应<2秒",
        "帮助商场优化布局，客流转化率提升20%",
        "系统被多个商业综合体采用，创造显著商业价值"
      ],
      year: "2022",
      status: "已完成",
      featured: false
    },
    {
      title: "事件预警工单小程序",
      description: "基于AI识别的智能预警系统，支持烟雾、火灾等异常事件的实时监测和工单管理",
      image: "🚨",
      role: "小程序开发工程师",
      technologies: ["Taro", "小程序", "AI识别", "云开发", "微信API"],
      achievements: [
        "集成摄像头、传感器监控的烟雾火灾检测",
        "开发预警通知和工单上报功能",
        "实现多端适配，支持微信、支付宝等平台",
        "构建手机横屏适配和短信提示系统"
      ],
      highlights: "AI预警 | 工单管理 | 多端适配",
      category: "移动应用",
      timeline: "2022年6月 - 2023年2月",
      teamSize: "3人开发团队",
      challenges: [
        "AI集成：火灾烟雾识别算法的小程序集成",
        "实时性要求：紧急事件的毫秒级响应和通知",
        "多端适配：Taro框架在不同平台的兼容性",
        "离线处理：网络不稳定时的数据缓存和同步"
      ],
      solutions: [
        "使用Taro统一开发框架实现多端部署",
        "集成云开发实现数据实时同步和存储",
        "实现本地缓存和断网重连机制",
        "优化AI识别接口调用和结果处理"
      ],
      results: [
        "预警准确率达到95%，误报率控制在5%以下",
        "响应时间平均10秒，大幅提升应急处理效率",
        "部署在50+个场所，保障安全监控全覆盖",
        "获得用户好评率90%+，成为智慧安防标杆应用"
      ],
      year: "2022",
      status: "已完成",
      featured: false
    },
    {
      title: "展恒基金网PC端",
      description: "专业的基金销售平台，提供基金申购、赎回、净值查询等全方位金融服务",
      image: "💰",
      role: "前端开发工程师",
      technologies: ["原生JS", "jQuery", "Bootstrap", "百度地图API", "Ajax"],
      achievements: [
        "开发用户基金申购、认购核心交易功能",
        "实现基金净值查询和收益计算系统",
        "集成百度地图API展示网点分布",
        "构建响应式页面布局和交互体验"
      ],
      highlights: "金融服务 | 基金交易 | 数据展示",
      category: "金融科技",
      timeline: "2015年10月 - 2017年12月",
      teamSize: "6人前端团队",
      challenges: [
        "金融安全：交易数据的加密传输和安全处理",
        "实时数据：基金净值和市场数据的实时更新",
        "用户体验：复杂金融产品的简化展示",
        "兼容性：多浏览器和不同设备的兼容适配"
      ],
      solutions: [
        "使用HTTPS和数据加密确保交易安全",
        "Ajax技术实现数据实时刷新和异步加载",
        "Bootstrap框架构建响应式布局",
        "原生JS和jQuery确保跨浏览器兼容性"
      ],
      results: [
        "网站服务10万+投资用户，日交易额千万级",
        "基金产品展示覆盖2000+只基金，数据准确及时",
        "用户交易转化率提升30%，客户满意度90%+",
        "成为展恒基金主要销售渠道，贡献60%+业务量"
      ],
      year: "2017",
      status: "已完成",
      featured: false
    },
    {
      title: "展恒基金微信公众号",
      description: "移动端基金服务平台，包含基金诊断、优选推荐、精准理财等特色功能",
      image: "📲",
      role: "独立开发者",
      technologies: ["Vue", "Mint UI", "Echarts", "微信API", "Axios"],
      achievements: [
        "开发基金诊断功能，智能分析用户持仓",
        "实现优选50功能，精选优质基金产品",
        "构建精准理财功能和点财通会员体系",
        "自定义微信分享到朋友圈和好友功能"
      ],
      highlights: "移动金融 | 智能推荐 | 社交分享",
      category: "移动应用",
      timeline: "2016年8月 - 2017年12月",
      teamSize: "独立开发",
      challenges: [
        "微信限制：公众号开发的各种API限制和规范",
        "移动适配：不同手机设备的页面适配和性能",
        "数据可视化：移动端图表的交互和展示优化",
        "用户留存：如何在微信生态内提升用户粘性"
      ],
      solutions: [
        "采用Vue MVVM架构，实现高效的数据绑定",
        "Mint UI确保移动端组件的流畅体验",
        "Echarts适配移动端，优化图表触摸交互",
        "微信分享API实现病毒式传播和用户增长"
      ],
      results: [
        "公众号粉丝达到8万+，月活跃用户3万+",
        "基金诊断功能使用率70%，用户粘性显著提升",
        "分享传播率25%，自然增长成为主要用户来源",
        "移动端交易转化率比PC端提升50%"
      ],
      year: "2017",
      status: "已完成",
      featured: false
    },
    {
      title: "企业级组件库",
      description: "基于React和TypeScript的企业级组件库，支持主题定制和多端适配",
      image: "🧩",
      role: "开源项目作者",
      technologies: ["React", "TypeScript", "Storybook", "Rollup", "Less", "Jest"],
      achievements: [
        "设计并开发50+个高质量React组件",
        "实现主题定制系统，支持动态换肤",
        "构建完整的文档和Storybook展示",
        "提供TypeScript类型定义和单元测试"
      ],
      highlights: "组件库 | 主题定制 | 工程化",
      category: "开源项目",
      timeline: "2023年3月 - 维护中",
      teamSize: "个人开源项目",
      challenges: [
        "组件设计：平衡通用性和灵活性的组件API设计",
        "主题系统：支持多套主题和运行时切换的架构",
        "构建优化：组件库的按需加载和Tree Shaking",
        "文档维护：保持文档和代码的同步更新"
      ],
      solutions: [
        "采用复合组件模式设计灵活的API",
        "CSS变量 + Less函数实现主题系统",
        "Rollup构建多格式输出，支持ES Module",
        "Storybook + MDX自动化文档生成"
      ],
      results: [
        "GitHub获得500+ Star，NPM下载量5万+",
        "被10+个项目采用，显著提升开发效率",
        "测试覆盖率90%+，代码质量获得社区认可",
        "成为团队内部标准组件库，统一设计语言"
      ],
      year: "2023",
      status: "维护中",
      featured: false
    },
    {
      title: "WebGL数据可视化引擎",
      description: "高性能的3D数据可视化引擎，支持大数据量的实时渲染和交互",
      image: "🎯",
      role: "技术研究员",
      technologies: ["WebGL", "Three.js", "TypeScript", "GLSL", "Web Workers"],
      achievements: [
        "开发高性能的WebGL渲染引擎内核",
        "实现百万级数据点的实时3D可视化",
        "构建可扩展的着色器系统和渲染管线",
        "提供易用的API和丰富的可视化组件"
      ],
      highlights: "3D可视化 | 高性能渲染 | 实时交互",
      category: "开源项目",
      timeline: "2024年1月 - 开发中",
      teamSize: "个人研究项目",
      challenges: [
        "性能优化：百万级数据的实时渲染性能瓶颈",
        "内存管理：大数据量下的内存使用和垃圾回收",
        "着色器开发：复杂的GLSL着色器编程和调试",
        "跨平台兼容：不同GPU和浏览器的兼容性问题"
      ],
      solutions: [
        "实例化渲染和LOD技术优化性能",
        "Web Workers异步处理数据计算",
        "模块化着色器系统和可视化调试工具",
        "渐进增强策略适配不同性能设备"
      ],
      results: [
        "渲染性能比传统方案提升10倍，支持百万点实时交互",
        "内存使用优化50%，避免浏览器崩溃问题",
        "已在2个商业项目中试用，效果显著",
        "计划开源发布，为可视化社区贡献力量"
      ],
      year: "2024",
      status: "开发中",
      featured: false
    }
  ];

  const categories = ["全部", "物联网 & 地图技术", "数据可视化", "教育技术", "移动应用", "金融科技", "开源项目"];

  const filteredProjects = selectedCategory === "全部" 
    ? allProjects 
    : allProjects.filter(project => project.category === selectedCategory);

  const handleProjectClick = (project: any) => {
    // 所有项目都可以查看详情
    onProjectSelect(project);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          
          {/* 模态框内容 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* 头部 */}
              <div className="relative p-6 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-b border-slate-700">
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  完整项目库
                </h2>
                <p className="text-slate-300 mb-6">
                  展示我在不同技术领域的全部项目成果和实践经验
                </p>
                
                {/* 分类筛选 */}
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-cyan-400"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* 项目网格 */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/60 transition-all duration-300 cursor-pointer"
                      onClick={() => handleProjectClick(project)}
                    >
                      {/* 特色项目标识 */}
                      {project.featured && (
                        <div className="absolute top-3 right-3 z-10">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                      )}

                      <div className="p-6">
                        {/* 项目头部 */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className="text-4xl">{project.image}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                              {project.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                              <span>{project.year}</span>
                              <span>•</span>
                              <span className={`px-2 py-1 rounded-full ${
                                project.status === "进行中" 
                                  ? "bg-green-500/20 text-green-400"
                                  : project.status === "维护中"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : project.status === "开发中"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-slate-500/20 text-slate-400"
                              }`}>
                                {project.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 项目描述 */}
                        <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        {/* 分类标签 */}
                        <div className="mb-4">
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
                            {project.category}
                          </span>
                        </div>

                        {/* 技术栈 */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.slice(0, 3).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 text-xs bg-slate-700/50 text-slate-400 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="px-2 py-1 text-xs text-slate-500">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 项目亮点 */}
                        <p className="text-xs text-slate-400 italic">
                          {project.highlights}
                        </p>

                        {/* 操作提示 */}
                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                          <div className="flex items-center gap-2 text-xs text-cyan-400">
                            <ExternalLink className="h-3 w-3" />
                            <span>点击查看详情</span>
                          </div>
                        </div>
                      </div>

                      {/* 悬停效果 */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </motion.div>
                  ))}
                </div>

                {/* 统计信息 */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{allProjects.length}</div>
                      <div className="text-sm text-slate-400">总项目数</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{categories.length - 1}</div>
                      <div className="text-sm text-slate-400">技术领域</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">9+</div>
                      <div className="text-sm text-slate-400">年经验</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{allProjects.filter(p => p.featured).length}</div>
                      <div className="text-sm text-slate-400">精选项目</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
} 