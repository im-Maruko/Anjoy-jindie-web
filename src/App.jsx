import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 👈 第一处修改：把原本引入 TestPage 的代码，换成引入 ExpenseForm
import ExpenseForm from './pages/ExpenseForm';

export default function App() {
    return (
        <ConfigProvider
            locale={zhCN}
            theme={{

            }}
        >
            {/*
        核心修复在这里：
        我们给最外层垫上了一块铺满屏幕高度...
      */}
            <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>

                {/* 👈 第二处修改：把原本的 <TestPage /> 替换为 <ExpenseForm /> */}
                <ExpenseForm />

            </div>
        </ConfigProvider>
    );
}