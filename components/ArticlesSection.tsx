"use client";
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, ArrowRight, Eye, Heart } from "lucide-react";

export function ArticlesSection() {
  const articles = [
    {
      title: "从零到一：无人机巡航系统的前端架构实践",
      excerpt: "深度复盘灵雀无人机项目的技术选型、架构设计和核心难点解决方案，分享在物联网设备控制场景下的前端开发经验。",
      category: "技术实践",
      date: "2024-03-15",
      readTime: "8 分钟",
      tags: ["React", "WebSocket", "物联网", "架构设计"],
      views: 1240,
      likes: 89,
      featured: true
    },
    {
      title: "地图可视化的性能优化：从卡顿到丝滑的技术之路",
      excerpt: "结合灵思地图项目经验，详细介绍大数据量地图应用的性能优化策略，包括渲染优化、内存管理和用户体验提升。",
      category: "性能优化", 
      date: "2024-02-28",
      readTime: "12 分钟",
      tags: ["Mapbox", "WebGL", "性能优化", "数据可视化"],
      views: 890,
      likes: 67,
      featured: true
    },
    {
      title: "前端工程师如何在AI时代保持竞争力",
      excerpt: "探讨人工智能对前端开发行业的影响，以及前端工程师如何通过技能升级和思维转变在AI时代中找到自己的定位。",
      category: "行业观察",
      date: "2024-01-20", 
      readTime: "6 分钟",
      tags: ["AI", "职业发展", "前端趋势", "技能规划"],
      views: 2150,
      likes: 156,
      featured: true
    },
    {
      title: "微信小程序开发的踩坑与填坑指南",
      excerpt: "基于鲸小爱背单词小程序开发经验，整理小程序开发中的常见问题、最佳实践和性能优化技巧。",
      category: "开发指南",
      date: "2023-12-10",
      readTime: "10 分钟", 
      tags: ["小程序", "mpvue", "性能优化", "最佳实践"],
      views: 756,
      likes: 43,
      featured: false
    }
  ];

  const featuredArticles = articles.filter(article => article.featured);

  return (
    <section className="relative py-20 bg-slate-900/30">
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
            精选文章
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            记录技术思考和项目复盘，分享前端开发的实践经验和行业洞察
          </p>
        </motion.div>

        {/* 精选文章网格 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {featuredArticles.map((article, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 cursor-pointer"
            >
              {/* 文章内容 */}
              <div className="p-8">
                {/* 分类和日期 */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full border border-cyan-500/30">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors leading-tight">
                  {article.title}
                </h3>

                {/* 摘要 */}
                <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-xs bg-slate-700/50 text-slate-400 rounded border border-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 文章数据和CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{article.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{article.likes}</span>
                    </div>
                  </div>
                  <button className="group/btn flex items-center gap-2 text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors">
                    <span>阅读全文</span>
                    <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* 悬停效果 */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </motion.article>
          ))}
        </div>

        {/* 文章分类导航 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {["全部", "技术实践", "性能优化", "行业观察", "开发指南"].map((category, index) => (
            <button
              key={index}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                index === 0
                  ? "bg-cyan-500 text-white"
                  : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-400"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* 查看更多文章 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-xl text-cyan-300 font-medium hover:from-cyan-500/20 hover:to-blue-600/20 transition-all duration-300">
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              查看完整博客
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </motion.div>

        {/* 写作统计 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "20+", label: "技术文章" },
            { number: "5000+", label: "总阅读量" },
            { number: "300+", label: "获得点赞" },
            { number: "50+", label: "读者互动" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-slate-400 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 