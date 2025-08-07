import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';

// 定义消息类型
interface Message {
    id: number;
    content: string;
    timestamp: number;
    type: 'system' | 'user' | 'notification';
}

// 定义Context类型
interface MessageContextType {
    message: Message;
    stableMessage: Message;
    updateMessage: (content: string) => void;
    messageCount: number;
}

// 创建Context
const MessageContext = createContext<MessageContextType | null>(null);

// 自定义Hook
const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within MessageProvider');
    }
    return context;
};

// 性能监控Hook
const useRenderCount = (componentName: string) => {
    const renderCount = useRef(0);
    renderCount.current += 1;

    useEffect(() => {
        console.log(`${componentName} 渲染次数: ${renderCount.current}`);
    });

    return renderCount.current;
};

// Context Provider
const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<Message>({
        id: 0,
        content: '初始消息',
        timestamp: Date.now(),
        type: 'system'
    });

    // 添加一个不变化的message用于测试memo效果
    const [stableMessage] = useState<Message>({
        id: 999,
        content: '这是一个稳定的消息，不会变化',
        timestamp: Date.now(),
        type: 'system'
    });

    const [messageCount, setMessageCount] = useState(0);

    // 模拟1秒更新一次的消息
    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prev => ({
                id: prev.id + 1,
                content: `实时消息 ${prev.id + 1} - ${new Date().toLocaleTimeString()}`,
                timestamp: Date.now(),
                type: 'notification'
            }));
            setMessageCount(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const updateMessage = useCallback((content: string) => {
        setMessage(prev => ({
            ...prev,
            content,
            timestamp: Date.now(),
            type: 'user'
        }));
    }, []);

    const contextValue = useMemo(() => ({
        message,
        stableMessage, // 添加稳定的message
        updateMessage,
        messageCount
    }), [message, stableMessage, updateMessage, messageCount]);

    const renderCount = useRenderCount('MessageProvider');

    return (
        <MessageContext.Provider value={contextValue}>
            <div style={{
                padding: '10px',
                margin: '10px',
                border: '2px solid #ff6b6b',
                backgroundColor: '#ffe6e6'
            }}>
                <h3>MessageProvider (渲染次数: {renderCount})</h3>
                <p>变化的消息ID: {message.id}</p>
                <p>变化的消息内容: {message.content}</p>
                <p>稳定的消息ID: {stableMessage.id}</p>
                <p>稳定的消息内容: {stableMessage.content}</p>
                <p>总消息数: {messageCount}</p>
                {children}
            </div>
        </MessageContext.Provider>
    );
};

// 子组件1 - 使用Context (会重新渲染)
const ChildComponent1: React.FC = () => {
    const { message } = useMessage();
    const renderCount = useRenderCount('ChildComponent1');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #4ecdc4',
            backgroundColor: '#e0f9f6'
        }}>
            <h3>子组件1 (使用Context) - 渲染次数: {renderCount}</h3>
            <p>消息ID: {message.id}</p>
            <p>消息内容: {message.content}</p>
            <p>消息类型: {message.type}</p>
        </div>
    );
};

// 子组件2 - 使用Context + 更新功能
const ChildComponent2: React.FC = () => {
    const { message, updateMessage } = useMessage();
    const renderCount = useRenderCount('ChildComponent2');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #45b7d1',
            backgroundColor: '#e0f4f8'
        }}>
            <h3>子组件2 (使用Context + 更新功能) - 渲染次数: {renderCount}</h3>
            <p>消息ID: {message.id}</p>
            <p>消息内容: {message.content}</p>
            <p>消息类型: {message.type}</p>
            <button onClick={() => updateMessage(`手动更新 - ${Date.now()}`)}>
                手动更新消息
            </button>
        </div>
    );
};

// 子组件3 - 不使用Context (不会因为Context变化而重新渲染)
const ChildComponent3: React.FC = () => {
    const [localState, setLocalState] = useState(0);
    const renderCount = useRenderCount('ChildComponent3');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #96ceb4',
            backgroundColor: '#e8f5e8'
        }}>
            <h3>子组件3 (不使用Context) - 渲染次数: {renderCount}</h3>
            <p>本地状态: {localState}</p>
            <button onClick={() => setLocalState(prev => prev + 1)}>
                增加本地状态
            </button>
        </div>
    );
};

// 使用React.memo优化的子组件
const OptimizedChildComponent: React.FC = React.memo(() => {
    const { message } = useMessage();
    const renderCount = useRenderCount('OptimizedChildComponent');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #feca57',
            backgroundColor: '#fff9e0'
        }}>
            <h3>优化子组件 (使用React.memo) - 渲染次数: {renderCount}</h3>
            <p>消息ID: {message.id}</p>
            <p>消息内容: {message.content}</p>
            <p>消息类型: {message.type}</p>
        </div>
    );
});

// 通过props接收数据的memo组件 - 这个才能真正展示memo的效果
const MemoizedPropsComponent: React.FC<{ message: Message }> = React.memo(({ message }) => {
    const renderCount = useRenderCount('MemoizedPropsComponent');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ff6b35',
            backgroundColor: '#fff4e6'
        }}>
            <h3>Memoized Props组件 (真正展示memo效果) - 渲染次数: {renderCount}</h3>
            <p>消息ID: {message.id}</p>
            <p>消息内容: {message.content}</p>
            <p>消息类型: {message.type}</p>
        </div>
    );
});

// 包装组件，用于向MemoizedPropsComponent传递props
const MemoizedPropsWrapper: React.FC = () => {
    const { message } = useMessage();
    const renderCount = useRenderCount('MemoizedPropsWrapper');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '2px solid #ff6b35',
            backgroundColor: '#fff4e6'
        }}>
            <h3>Memoized Props包装器 - 渲染次数: {renderCount}</h3>
            <MemoizedPropsComponent message={message} />
        </div>
    );
};

// 使用稳定message的memo组件 - 这个应该不会频繁重新渲染
const StableMemoizedComponent: React.FC = React.memo(() => {
    const { stableMessage } = useMessage();
    const renderCount = useRenderCount('StableMemoizedComponent');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #2ecc71',
            backgroundColor: '#e8f8f5'
        }}>
            <h3>稳定Memo组件 (使用稳定message) - 渲染次数: {renderCount}</h3>
            <p>消息ID: {stableMessage.id}</p>
            <p>消息内容: {stableMessage.content}</p>
            <p>消息类型: {stableMessage.type}</p>
            <p style={{ color: '#27ae60', fontWeight: 'bold' }}>
                ✅ 这个组件应该很少重新渲染，因为stableMessage不会变化
            </p>
        </div>
    );
});

// 选择性订阅Context的子组件
const SelectiveChildComponent: React.FC = () => {
    const { messageCount } = useMessage(); // 只订阅messageCount
    const renderCount = useRenderCount('SelectiveChildComponent');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #54a0ff',
            backgroundColor: '#e0f0ff'
        }}>
            <h3>选择性订阅组件 (只订阅messageCount) - 渲染次数: {renderCount}</h3>
            <p>总消息数: {messageCount}</p>
            <p>注意: 这个组件只订阅messageCount，不会因为message内容变化而重新渲染</p>
        </div>
    );
};

// 使用useMemo优化的子组件
const MemoizedChildComponent: React.FC = () => {
    const { message } = useMessage();
    const renderCount = useRenderCount('MemoizedChildComponent');

    const memoizedContent = useMemo(() => (
        <div>
            <p>消息ID: {message.id}</p>
            <p>消息内容: {message.content}</p>
            <p>消息类型: {message.type}</p>
        </div>
    ), [message.id, message.content, message.type]);

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ff9ff3',
            backgroundColor: '#ffe0f8'
        }}>
            <h3>Memoized子组件 (使用useMemo) - 渲染次数: {renderCount}</h3>
            {memoizedContent}
        </div>
    );
};

// 性能监控组件
const PerformanceMonitor: React.FC = () => {
    const [renderStats, setRenderStats] = useState<Record<string, number>>({});
    const statsRef = useRef<Record<string, number>>({});

    useEffect(() => {
        const interval = setInterval(() => {
            setRenderStats({ ...statsRef.current });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const updateStats = (componentName: string) => {
        statsRef.current[componentName] = (statsRef.current[componentName] || 0) + 1;
    };

    return (
        <div style={{
            padding: '15px',
            margin: '15px',
            border: '2px solid #2c3e50',
            backgroundColor: '#34495e',
            color: 'white'
        }}>
            <h3>性能监控面板</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {Object.entries(renderStats).map(([component, count]) => (
                    <div key={component} style={{
                        padding: '5px',
                        backgroundColor: '#2c3e50',
                        borderRadius: '4px'
                    }}>
                        <strong>{component}:</strong> {count} 次渲染
                    </div>
                ))}
            </div>
        </div>
    );
};

// 主组件
const DemoApp: React.FC = () => {
    const renderCount = useRenderCount('DemoApp');

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Context 重新渲染性能测试 Demo</h1>
            <p>这个demo测试Context透传实时消息是否会导致所有子组件重新渲染</p>
            <p>消息每1秒更新一次，请观察控制台输出和渲染次数</p>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <h2>测试结果说明：</h2>
                <ul>
                    <li><strong>使用Context的子组件</strong>: 会在Context值变化时重新渲染</li>
                    <li><strong>不使用Context的子组件</strong>: 不会因为Context变化而重新渲染</li>
                    <li><strong>React.memo + 变化的数据</strong>: 不起作用！因为数据一直在变化（如message.id递增）</li>
                    <li><strong>React.memo + 稳定的数据</strong>: 起作用！当数据真正稳定时，memo可以避免重新渲染</li>
                    <li><strong>React.memo + Props传递</strong>: 真正起作用！通过props传递数据可以避免不必要的重新渲染</li>
                    <li><strong>useMemo</strong>: 可以优化渲染性能，减少重复计算</li>
                    <li><strong>选择性订阅</strong>: 只订阅需要的Context值，减少不必要的重新渲染</li>
                </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
                <PerformanceMonitor />
                <ChildComponent1 />
                <ChildComponent2 />
                <ChildComponent3 />
                <OptimizedChildComponent />
                <MemoizedPropsWrapper />
                <StableMemoizedComponent />
                <SelectiveChildComponent />
                <MemoizedChildComponent />
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
                <h3>优化建议：</h3>
                <ol>
                    <li>将Context拆分为多个小的Context，避免一个Context变化影响所有组件</li>
                    <li>使用React.memo包装通过props接收数据的组件（对直接订阅Context的组件无效）</li>
                    <li>使用useMemo缓存计算结果和JSX</li>
                    <li>只订阅需要的Context值，避免订阅整个Context对象</li>
                    <li>考虑使用状态管理库（如Redux、Zustand）替代Context</li>
                    <li>通过props传递数据而不是直接订阅Context，这样React.memo才能起作用</li>
                    <li><strong>关键点</strong>: React.memo只有在数据真正稳定时才起作用，如果数据一直在变化（如递增的ID），memo就无效</li>
                </ol>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
                <h3>🔍 为什么React.memo不起作用？</h3>
                <p><strong>你的观察完全正确！</strong></p>
                <ul>
                    <li><strong>数据一直在变化</strong>: message.id 每秒都在递增，导致每次都是新的对象</li>
                    <li><strong>React.memo的浅比较</strong>: 当props/context值变化时，memo无法阻止重新渲染</li>
                    <li><strong>Context订阅机制</strong>: 直接订阅Context的组件在Context变化时会强制重新渲染</li>
                </ul>
                <p><strong>解决方案</strong>:</p>
                <ul>
                    <li>使用稳定的数据（如stableMessage）</li>
                    <li>通过props传递数据而不是直接订阅Context</li>
                    <li>只订阅真正需要的Context值</li>
                    <li>使用useMemo缓存计算结果</li>
                </ul>
            </div>
        </div>
    );
};

// 完整的App组件
const App: React.FC = () => {
    return (
        <MessageProvider>
            <DemoApp />
        </MessageProvider>
    );
};

export default App; 