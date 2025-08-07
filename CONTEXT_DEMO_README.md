# Context 重新渲染测试 Demo

这个 demo 用于测试 React Context 透传实时消息是否会导致所有子组件重新渲染。

## 文件说明

- `demo-context-render.tsx` - 基础版本的测试 demo
- `demo-context-performance.tsx` - 详细版本，包含性能监控和优化建议
- `pages/test-context.tsx` - Next.js 页面，用于在浏览器中运行测试

## 测试内容

### 1. 基础测试

- **MessageProvider**: Context 提供者，每 1 秒更新一次消息
- **ChildComponent1**: 使用 Context 的子组件（会重新渲染）
- **ChildComponent2**: 使用 Context + 更新功能的子组件
- **ChildComponent3**: 不使用 Context 的子组件（不会因为 Context 变化而重新渲染）

### 2. 优化测试

- **OptimizedChildComponent**: 使用 React.memo 优化的组件
- **MemoizedChildComponent**: 使用 useMemo 优化的组件
- **SelectiveChildComponent**: 选择性订阅 Context 的组件

### 3. 性能监控

- 实时显示每个组件的渲染次数
- 控制台输出详细的渲染信息

## 运行方法

1. 启动开发服务器：

```bash
npm run dev
```

2. 访问测试页面：

```
http://localhost:3000/test-context
```

3. 打开浏览器控制台观察渲染日志

## 预期结果

### ✅ 会重新渲染的组件：

- MessageProvider（Context 提供者）
- ChildComponent1（使用 Context）
- ChildComponent2（使用 Context + 更新功能）
- OptimizedChildComponent（即使使用 React.memo，Context 变化时仍会重新渲染）
- MemoizedChildComponent（使用 useMemo，但 Context 变化时仍会重新渲染）
- SelectiveChildComponent（只订阅 messageCount，不会因为 message 内容变化而重新渲染）

### ❌ 不会因为 Context 变化而重新渲染的组件：

- ChildComponent3（不使用 Context）

## 关键发现

1. **Context 变化会导致所有使用该 Context 的子组件重新渲染**

   - 即使使用 React.memo，Context 变化时组件仍会重新渲染
   - 这是因为 Context 的订阅机制，当 Context 值变化时，所有订阅者都会收到通知

2. **优化策略**

   - 使用 React.memo 可以减少不必要的重新渲染（但 Context 变化时无效）
   - 使用 useMemo 可以优化渲染性能，减少重复计算
   - 选择性订阅 Context 值可以减少不必要的重新渲染
   - 将 Context 拆分为多个小的 Context

3. **性能影响**
   - 频繁的 Context 更新会导致大量组件重新渲染
   - 对于实时消息这种高频更新场景，需要考虑性能优化

## 优化建议

### 1. Context 拆分

```typescript
// 将一个大Context拆分为多个小Context
const MessageContext = createContext<Message | null>(null);
const MessageCountContext = createContext<number>(0);
const UpdateMessageContext = createContext<((content: string) => void) | null>(
  null
);
```

### 2. 使用状态管理库

```typescript
// 考虑使用Zustand等状态管理库
import { create } from 'zustand';

const useMessageStore = create((set) => ({
  message: { id: 0, content: '', timestamp: 0 },
  updateMessage: (content: string) =>
    set((state) => ({
      message: { ...state.message, content }
    }))
}));
```

### 3. 选择性订阅

```typescript
// 只订阅需要的Context值
const { messageCount } = useMessage(); // 只订阅messageCount
```

### 4. 使用 React.memo + 自定义比较函数

```typescript
const OptimizedComponent = React.memo(
  ({ message }) => {
    // 组件内容
  },
  (prevProps, nextProps) => {
    // 自定义比较逻辑
    return prevProps.message.id === nextProps.message.id;
  }
);
```

## 结论

**是的，Context 透传实时消息会导致所有使用该 Context 的子组件重新渲染。**

对于高频更新的实时消息场景，建议：

1. 将 Context 拆分为多个小的 Context
2. 使用状态管理库替代 Context
3. 只订阅需要的 Context 值
4. 考虑使用 WebSocket 或其他实时通信方案
5. 使用虚拟滚动等技术优化大量数据的渲染性能
