import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

// 定义消息类型
interface Message {
    id: number;
    content: string;
    timestamp: number;
}

// 定义Context类型
interface MessageContextType {
    message: Message;
    updateMessage: (content: string) => void;
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

// Context Provider
const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<Message>({
        id: 0,
        content: '初始消息',
        timestamp: Date.now()
    });

    // 模拟1秒更新一次的消息
    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prev => ({
                id: prev.id + 1,
                content: `实时消息 ${prev.id + 1} - ${new Date().toLocaleTimeString()}`,
                timestamp: Date.now()
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const updateMessage = useCallback((content: string) => {
        setMessage(prev => ({
            ...prev,
            content,
            timestamp: Date.now()
        }));
    }, []);

    const contextValue = useMemo(() => ({
        message,
        updateMessage
    }), [message, updateMessage]);

    console.log('MessageProvider 重新渲染');

    return (
        <MessageContext.Provider value={contextValue}>
            {children}
        </MessageContext.Provider>
    );
};

// 子组件1 - 使用Context
const ChildComponent1: React.FC = () => {
    const { message } = useMessage();

    console.log('ChildComponent1 重新渲染');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ccc',
            backgroundColor: '#f0f0f0'
        }}>
            <h3>子组件1 (使用Context)</h3>
            <p>消息ID: {message.id}</p>
            <p>消息内容: {message.content}</p>
            <p>时间戳: {message.timestamp}</p>
        </div>
    );
};

// 子组件2 - 使用Context
const ChildComponent2: React.FC = () => {
    const { message, updateMessage } = useMessage();

    console.log('ChildComponent2 重新渲染');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ccc',
            backgroundColor: '#e0e0e0'
        }}>
            <h3>子组件2 (使用Context + 更新功能)</h3>
            <p>消息ID: {message.id}</p>
            <p>消息内容: {message.content}</p>
            <p>时间戳: {message.timestamp}</p>
            <button onClick={() => updateMessage(`手动更新 - ${Date.now()}`)}>
                手动更新消息
            </button>
        </div>
    );
};

// 子组件3 - 不使用Context
const ChildComponent3: React.FC = () => {
    const [localState, setLocalState] = useState(0);

    console.log('ChildComponent3 重新渲染 (不使用Context)');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ccc',
            backgroundColor: '#d0d0d0'
        }}>
            <h3>子组件3 (不使用Context)</h3>
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

    console.log('OptimizedChildComponent 重新渲染 (使用React.memo)');

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ccc',
            backgroundColor: '#c0c0c0'
        }}>
            <h3>优化子组件 (使用React.memo)</h3>
            <p>消息ID: {message.id}</p>
            <p>消息内容: {message.content}</p>
            <p>时间戳: {message.timestamp}</p>
        </div>
    );
});

// 使用useMemo优化的子组件
const MemoizedChildComponent: React.FC = () => {
    const { message } = useMessage();

    console.log('MemoizedChildComponent 重新渲染 (使用useMemo)');

    const memoizedContent = useMemo(() => (
        <div>
            <p>消息ID: {message.id}</p>
            <p>消息内容: {message.content}</p>
            <p>时间戳: {message.timestamp}</p>
        </div>
    ), [message.id, message.content, message.timestamp]);

    return (
        <div style={{
            padding: '10px',
            margin: '10px',
            border: '1px solid #ccc',
            backgroundColor: '#b0b0b0'
        }}>
            <h3>Memoized子组件 (使用useMemo)</h3>
            {memoizedContent}
        </div>
    );
};

// 主组件
const DemoApp: React.FC = () => {
    console.log('DemoApp 重新渲染');

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Context 重新渲染测试 Demo</h1>
            <p>这个demo测试Context透传实时消息是否会导致所有子组件重新渲染</p>
            <p>消息每1秒更新一次，请观察控制台输出</p>

            <div style={{ marginTop: '20px' }}>
                <h2>测试结果说明：</h2>
                <ul>
                    <li>使用Context的子组件会在Context值变化时重新渲染</li>
                    <li>不使用Context的子组件不会因为Context变化而重新渲染</li>
                    <li>使用React.memo可以避免不必要的重新渲染</li>
                    <li>使用useMemo可以优化渲染性能</li>
                </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
                <ChildComponent1 />
                <ChildComponent2 />
                <ChildComponent3 />
                <OptimizedChildComponent />
                <MemoizedChildComponent />
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