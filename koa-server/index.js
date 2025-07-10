const Koa = require('koa');
const Router = require('koa-router');
const { koaBody } = require('koa-body'); // 修正此处
const fs = require('fs-extra');
const path = require('path');
const cors = require('@koa/cors'); // 新增

const app = new Koa();
app.use(cors()); // 新增
const router = new Router();

// 上传简历接口
router.post('/upload-resume', koaBody({ multipart: true }), async (ctx) => {
  // 打印调试
  console.log('收到文件：', ctx.request.files);

  const files = ctx.request.files;
  if (!files || !files.file) {
    ctx.status = 400;
    ctx.body = { message: '未检测到上传文件，请确保字段名为 file' };
    return;
  }
  const file = files.file;
  const filePath = file.filepath || file.path; // 兼容新版 koa-body
  if (!filePath) {
    ctx.status = 400;
    ctx.body = { message: '文件内容无效' };
    return;
  }
  const reader = fs.createReadStream(filePath);
  const resumePath = path.resolve(__dirname, '../public/resume.pdf');
  const stream = fs.createWriteStream(resumePath);
  reader.pipe(stream);
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
  ctx.body = { message: '上传成功', path: '/resume.pdf' };
});

app.use(router.routes()).use(router.allowedMethods());

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Koa server running at http://localhost:${PORT}`);
});
