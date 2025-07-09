import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="杨恒利个人网站 - 专注前端开发和可视化技术的工程师" />
        <meta name="keywords" content="前端开发,React,Vue,数据可视化,地图应用,无人机控制系统" />
        <meta name="author" content="杨恒利" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 