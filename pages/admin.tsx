"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, Home } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState("");
    const [uploadStatus, setUploadStatus] = useState<"success" | "error" | "">("");

    // 上传简历功能
    const handleResumeUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploadMsg("");
        setUploading(true);
        setUploadStatus("");

        const form = e.target as HTMLFormElement;
        const fileInput = form.elements.namedItem('resumeFile') as HTMLInputElement;

        if (!fileInput.files || fileInput.files.length === 0) {
            setUploadMsg("请选择要上传的简历文件");
            setUploadStatus("error");
            setUploading(false);
            return;
        }

        const file = fileInput.files[0];

        // 检查文件类型
        if (file.type !== 'application/pdf') {
            setUploadMsg("只能上传 PDF 格式的文件");
            setUploadStatus("error");
            setUploading(false);
            return;
        }

        // 检查文件大小（限制为 10MB）
        if (file.size > 10 * 1024 * 1024) {
            setUploadMsg("文件大小不能超过 10MB");
            setUploadStatus("error");
            setUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('http://localhost:4000/upload-resume', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setUploadMsg(`上传成功！文件名: ${file.name}`);
                setUploadStatus("success");
                // 清空文件选择
                form.reset();
            } else {
                setUploadMsg(data.message || '上传失败');
                setUploadStatus("error");
            }
        } catch (err) {
            setUploadMsg('上传失败，请检查网络连接或后端服务是否启动');
            setUploadStatus("error");
        }

        setUploading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* 导航栏 */}
            <nav className="bg-slate-900/50 border-b border-slate-800 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold text-cyan-400">后台管理</h1>
                        </div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            返回首页
                        </Link>
                    </div>
                </div>
            </nav>

            {/* 主要内容 */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {/* 页面标题 */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent mb-4">
                            网站管理中心
                        </h2>
                        <p className="text-slate-400">
                            管理网站内容，更新个人简历等操作
                        </p>
                    </div>

                    {/* 简历上传卡片 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-cyan-500/20 rounded-lg">
                                <FileText className="h-6 w-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">简历管理</h3>
                                <p className="text-slate-400 text-sm">上传或更新个人简历文件</p>
                            </div>
                        </div>

                        <form onSubmit={handleResumeUpload} className="space-y-6">
                            {/* 文件选择区域 */}
                            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors">
                                <Upload className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                                <div className="space-y-2">
                                    <label htmlFor="resumeFile" className="cursor-pointer">
                                        <span className="text-lg font-medium text-white hover:text-cyan-400 transition-colors">
                                            点击选择文件或拖拽到此处
                                        </span>
                                        <input
                                            type="file"
                                            id="resumeFile"
                                            name="resumeFile"
                                            accept=".pdf"
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-slate-400 text-sm">
                                        仅支持 PDF 格式，文件大小不超过 10MB
                                    </p>
                                </div>
                            </div>

                            {/* 上传按钮 */}
                            <button
                                type="submit"
                                disabled={uploading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        上传中...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4" />
                                        上传简历
                                    </>
                                )}
                            </button>

                            {/* 上传结果提示 */}
                            {uploadMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-center gap-2 p-4 rounded-lg ${uploadStatus === "success"
                                            ? "bg-green-500/20 border border-green-500/30 text-green-400"
                                            : "bg-red-500/20 border border-red-500/30 text-red-400"
                                        }`}
                                >
                                    {uploadStatus === "success" ? (
                                        <CheckCircle className="h-5 w-5" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5" />
                                    )}
                                    <span>{uploadMsg}</span>
                                </motion.div>
                            )}
                        </form>
                    </motion.div>

                    {/* 其他管理功能区域（可扩展） */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50"
                    >
                        <h3 className="text-xl font-semibold text-white mb-4">其他管理功能</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-700/30 rounded-lg">
                                <h4 className="font-medium text-white mb-2">项目管理</h4>
                                <p className="text-slate-400 text-sm">编辑和更新项目信息</p>
                            </div>
                            <div className="p-4 bg-slate-700/30 rounded-lg">
                                <h4 className="font-medium text-white mb-2">技能更新</h4>
                                <p className="text-slate-400 text-sm">添加新技能或更新技能等级</p>
                            </div>
                            <div className="p-4 bg-slate-700/30 rounded-lg">
                                <h4 className="font-medium text-white mb-2">文章管理</h4>
                                <p className="text-slate-400 text-sm">发布和编辑技术文章</p>
                            </div>
                            <div className="p-4 bg-slate-700/30 rounded-lg">
                                <h4 className="font-medium text-white mb-2">网站统计</h4>
                                <p className="text-slate-400 text-sm">查看访问数据和用户行为</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
} 