import React, { useState } from 'react';
import { Card, Avatar, Typography, Button, Row, Col, Modal, Upload, Tooltip, Space, Empty, Input, InputNumber, DatePicker, Select, Switch, Table } from 'antd';
// 🌟 这里帮你补上了 SearchOutlined，防止白屏
import { UserOutlined, SwapOutlined, ProfileOutlined, PartitionOutlined, PlusOutlined, UploadOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
    PageContainer,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormDatePicker,
    ProFormSwitch,
    EditableProTable,
    FooterToolbar,
    ProFormUploadDragger, ProFormTextArea
} from '@ant-design/pro-components';
const { Title } = Typography;
const { Text } = Typography;

export default function TestPage() {
    const [editableKeys, setEditableRowKeys] = useState([]);

    // 默认选项为“日常费用”
    const [currentExpenseType, setCurrentExpenseType] = useState('daily');
    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

    // 假数据
    const defaultData = [
        { id: '1', fieldA: '测试数据1', fieldB: '内容1', amount: 15000 },
        { id: '2', fieldA: '测试数据2', fieldB: '内容2', amount: 3200 },
    ];

    // 文本输入框：默认 "请输入"
    const renderFilledInput = (props) => {
        // 只认我们在 fieldProps 里显式写的 placeholder (例如 getSearchFieldProps 传进来的)
        const explicitPlaceholder = props?.fieldProps?.placeholder;
        return (
            <Input
                variant="filled"
                {...props}
                // 放到 {...props} 后面，强制覆盖 ProTable 自动生成的啰嗦提示词
                placeholder={explicitPlaceholder || '请输入'}
            />
        );
    };

// 数字金额输入框：默认 "请输入"
    const renderFilledNumber = (props) => {
        const explicitPlaceholder = props?.fieldProps?.placeholder;
        return (
            <InputNumber
                variant="filled"
                style={{ width: '100%' }}
                {...props}
                placeholder={explicitPlaceholder || '请输入'}
            />
        );
    };

// 日期选择框：默认 "请选择"
    const renderFilledDate = (props) => {
        const explicitPlaceholder = props?.fieldProps?.placeholder;
        return (
            <DatePicker
                variant="filled"
                style={{ width: '100%' }}
                {...props}
                placeholder={explicitPlaceholder || '请选择'}
            />
        );
    };

    const renderFilledSwitch = (props) => <Switch {...props} />;

// getSearchFieldProps 保持你截图里的原样即可
    const getSearchFieldProps = (fieldName) => ({
        placeholder: '请选择或输入',
        autoComplete: 'off',
        suffix: (
            <ProfileOutlined
                style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                onClick={(e) => {
                    e.stopPropagation();
                    console.log(`点击了【${fieldName}】图标，准备触发弹窗`);
                }}
            />
        )
    });

    // 使用这个专门包装过 suffix 的输入框，并注入 filled
    const renderFilledSearchInput = (fieldName) => {
        return (item, { type, defaultRender, ...rest }, form) => {
            if (type === 'form') {
                return null;
            }
            return <Input variant="filled" {...rest} {...getSearchFieldProps(fieldName)} />;
        };
    };

    const expenseColumns = [
        { title: '序号', valueType: 'indexBorder', width: 48, fixed: 'left' },
        {
            title: <span className="table-header-required">费用项目</span>,
            dataIndex: 'expenseItem', valueType: 'text',
            width: 230,
            formItemProps: { rules: [{ required: true, message: '必填' }] },
            fieldProps: {
                variant: 'filled',
                placeholder: '请选择或输入',
                suffix: <ProfileOutlined
                    style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('点击了申请区域图标，在这里触发弹窗');
                    }}
                />
            }
        },
        {
            title: <span className="table-header-required">原币申请金额</span>,
            dataIndex: 'originalAmount',
            width: 140,
            formItemProps: { rules: [{ required: true, message: '必填' }] },
            // 👇 恢复极简写法，底层函数会自动处理 '请输入'
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => renderFilledNumber(rest),
        },
        {
            title: '可用余额',
            dataIndex: 'availableBalance',
            width: 120,
            renderFormItem: renderFilledSearchInput('可用余额'),
        },
        {
            title: '本位币可用余额',
            dataIndex: 'baseAvailableBalance',
            width: 130,
            renderFormItem: renderFilledSearchInput('本位币可用余额'),
        },
        {
            title: '本位币已用金额',
            dataIndex: 'baseUsedAmount',
            width: 130,
            renderFormItem: renderFilledSearchInput('本位币已用金额'),
        },
        {
            title: '期望付款日期',
            dataIndex: 'expectPayDate',
            width: 160,
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => renderFilledDate(rest),
        },
        {
            title: '厂编', dataIndex: 'expenseCustomer', valueType: 'text',
            width: 200,
            fieldProps: {
                variant: 'filled',
                placeholder: '请选择或输入',
                suffix: <ProfileOutlined
                    style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('点击了申请区域图标，在这里触发弹窗');
                    }}
                />
            }
        },

        {
            title: '费用客户', dataIndex: 'expenseCustomer', valueType: 'text',
            width: 230,
            fieldProps: {
                variant: 'filled',
                placeholder: '请选择或输入',
                suffix: <ProfileOutlined
                    style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('点击了申请区域图标，在这里触发弹窗');
                    }}
                />
            }
        },
        {
            title: '呈送单号',
            dataIndex: 'submissionNo',
            width: 170,
            // 👇 恢复极简写法，统一为 '请输入'
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => renderFilledInput(rest),
        },
        {
            title: <span className="table-header-required">费用说明</span>,
            dataIndex: 'expenseDesc',
            width: 200,
            formItemProps: { rules: [{ required: true, message: '必填' }] },
            // 👇 恢复极简写法
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => renderFilledInput(rest),
        },
        {
            title: <span className="table-header-required">归属日期</span>,
            dataIndex: 'attributionDate',
            width: 160,
            formItemProps: { rules: [{ required: true, message: '必填' }] },
            // 👇 恢复极简写法
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => renderFilledDate(rest),
        },
        {
            title: '下游单据编码',
            dataIndex: 'downstreamCode',
            width: 130,
            renderFormItem: renderFilledSearchInput('下游单据编码'),
        },
        {
            title: '多项目模式',
            dataIndex: 'multiProjectMode',
            width: 100,
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => renderFilledSwitch(rest),
        },
        {
            title: '项目号A', dataIndex: 'projectNoA', valueType: 'text',
            width: 230,
            fieldProps: {
                variant: 'filled',
                placeholder: '请选择或输入',
                suffix: <ProfileOutlined
                    style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('点击了申请区域图标，在这里触发弹窗');
                    }}
                />
            }
        },
        {
            title: '预算项目', dataIndex: 'budgetProject', valueType: 'text',
            width: 230,
            fieldProps: {
                variant: 'filled',
                placeholder: '请选择或输入',
                suffix: <ProfileOutlined
                    style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('点击了申请区域图标，在这里触发弹窗');
                    }}
                />
            }
        },
        {
            title: '资金来源类型', dataIndex: 'fundSourceType', valueType: 'text',
            width: 250,
            fieldProps: {
                variant: 'filled',
                placeholder: '请选择或输入',
                suffix: <ProfileOutlined
                    style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('点击了申请区域图标，在这里触发弹窗');
                    }}
                />
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: 190,
            // 👇 恢复极简写法
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => renderFilledInput(rest),
        },
        {
            title: '未申请金额原币',
            dataIndex: 'unappliedOriginal',
            width: 140,
            readonly: true,
        },
        {
            title: '未申请金额本位币',
            dataIndex: 'unappliedBase',
            width: 140,
            readonly: true,
        },
        {
            title: '已申请金额原币',
            dataIndex: 'appliedOriginal',
            width: 140,
            readonly: true,
        },
        {
            title: '已申请金额本位币',
            dataIndex: 'appliedBase',
            width: 140,
            readonly: true,
        },
        {
            title: '是否新品支持',
            dataIndex: 'isNewProductSupport',
            width: 120,
            renderFormItem: (item, { type, defaultRender, ...rest }, form) => renderFilledSwitch(rest),
        },
        {
            title: '操作',
            valueType: 'option',
            width: 180,
            fixed: 'right',
            render: (text, record, _, action) => [
                <a key="editable" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
                <a key="copy" onClick={() => console.log('复制当前行:', record)}>复制行</a>,
            ],
        }
    ];

    // =====================================================================
    // 🏭 表头加工厂：每种类型的表格字段都完全独立！(全部加上了 variant: 'filled')
    // =====================================================================
    const getDynamicColumns = (type) => {
        const actionColumn = {
            title: '操作',
            valueType: 'option',
            width: 150,
            fixed: 'right',
            render: (text, record, _, action) => [
                <a key="editable" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
                <a key="copy" onClick={() => console.log('复制当前行数据：', record)}>复制行</a>,
            ],
        };

        // 3.2 商超审批单 - 专属表格
        if (type === 'supermarket_approval') {
            return [
                { title: '费用类型', dataIndex: 'expenseType', valueType: 'select', width: 160, fieldProps: { variant: 'filled', placeholder: '请选择'} },
                { title: '分类', dataIndex: 'category', valueType: 'select', width: 140, fieldProps: { variant: 'filled' , placeholder: '请选择'} },
                { title: '门店名称', dataIndex: 'storeName', valueType: 'text', width: 180, fieldProps: { variant: 'filled', placeholder: '请输入' } },
                { title: '现有专职', dataIndex: 'fullTimeCount', valueType: 'text', width: 160, fieldProps: { style: { width: '100%' }, variant: 'filled', placeholder: '请输入'  } },
                { title: '上年度费用金额', dataIndex: 'lastYearExpense', valueType: 'money', width: 160, fieldProps: { style: { width: '100%' }, variant: 'filled' , placeholder: '请输入'} },
                {
                    title: '上年度年费比',
                    dataIndex: 'lastYearRatio',
                    valueType: 'digit', // 使用数字输入框
                    width: 160,
                    fieldProps: {
                        addonAfter: '%', // 自动在输入框尾部加上百分号
                        style: { width: '100%' },
                        variant: 'filled', placeholder: '请输入'
                    }
                },
                { title: '本年度已使用金额', dataIndex: 'thisYearUsed', valueType: 'money', width: 160, fieldProps: { style: { width: '100%' }, variant: 'filled' , placeholder: '请输入'} },
                { title: '申请金额', dataIndex: 'applyAmount', valueType: 'money', width: 160, fieldProps: { style: { width: '100%' }, variant: 'filled', placeholder: '请输入' } },
                { title: '开始时间', dataIndex: 'startDate', valueType: 'date', width: 150, fieldProps: { variant: 'filled', placeholder: '请选择' } },
                { title: '结束时间', dataIndex: 'endDate', valueType: 'date', width: 150, fieldProps: { variant: 'filled', placeholder: '请选择' } },
                { title: '备注', dataIndex: 'remark', valueType: 'text', width: 260, fieldProps: { variant: 'filled', placeholder: '请输入' } },

                // 🌟 针对操作列被挤压的特殊处理：覆盖原本的宽度
                {
                    ...actionColumn,
                    width: 220, // 150 肯定不够放4个按钮，放大到 220 就能一字排开了
                },
            ];
        }

        // 3.3 卖场商超新品进场审批单 - 专属表格
        if (type === 'new_product_entry') {
            return [
                {
                    title: '申请区域', dataIndex: 'applyArea', valueType: 'text', // 🌟 第一步：改为 text，允许手动输入
                    width: 180,
                    fieldProps: {
                        variant: 'filled',
                        placeholder: '请选择或输入',
                        // 🌟 第二步：加上 suffix 图标，并绑定点击弹窗事件
                        suffix: <ProfileOutlined
                            style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                            onClick={(e) => {
                                e.stopPropagation(); // 阻止事件冒泡
                                console.log('点击了申请区域图标，在这里触发弹窗');
                                // setIsDeptModalOpen(true); // 后续你写了弹窗后，把控制弹窗的代码写这里
                            }}
                        />
                    }
                },
                {
                    title: '进场卖场商超名', dataIndex: 'marketName', valueType: 'text', width: 180,
                    fieldProps: {
                        variant: 'filled',
                        placeholder: '请选择或输入',
                        suffix: <ProfileOutlined
                            style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('点击了商超名图标，在这里触发弹窗');
                            }}
                        />
                    }
                },
                {
                    title: '物料', dataIndex: 'material', valueType: 'text', width: 180,
                    fieldProps: {
                        variant: 'filled',
                        placeholder: '请选择或输入',
                        suffix: <ProfileOutlined
                            style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('点击了物料图标，在这里触发弹窗');
                            }}
                        />
                    }
                },

                { title: '规格型号', dataIndex: 'specification', valueType: 'text', width: 140, fieldProps: { variant: 'filled' } },
                { title: '单价', dataIndex: 'unitPrice', valueType: 'money', width: 110, fieldProps: { style: { width: '100%' }, variant: 'filled' } },
                { title: '箱价', dataIndex: 'boxPrice', valueType: 'money', width: 110, fieldProps: { style: { width: '100%' }, variant: 'filled' } },
                { title: '进场费用承担情况', dataIndex: 'feeBearingStatus', valueType: 'text', width: 180, fieldProps: { variant: 'filled' } },
                { title: '其他', dataIndex: 'otherRemark', valueType: 'text', width: 140, fieldProps: { variant: 'filled' } },
                { title: '价格生效日期', dataIndex: 'effectiveDate', valueType: 'date', width: 140, fieldProps: { variant: 'filled' } },
                { title: '售价', dataIndex: 'sellingPrice', valueType: 'money', width: 140, fieldProps: { style: { width: '100%' }, variant: 'filled' } },

                // 🌟 覆盖操作列的宽度，放宽到 220 防止四个按钮挤成两行
                {
                    ...actionColumn,
                    width: 220,
                },
            ];
        }

        // 4.1 广告费用申请单 - 专属表格
        if (type === 'ad_expense') {
            return [
                { title: '项目名称', dataIndex: 'projectName', valueType: 'text', width: 180, fieldProps: { variant: 'filled' } },
                { title: '材质', dataIndex: 'material', valueType: 'text', width: 160, fieldProps: { variant: 'filled' } },
                // 拆分长宽
                { title: '长(m)', dataIndex: 'length', valueType: 'digit', width: 100, fieldProps: { variant: 'filled' } },
                { title: '宽(m)', dataIndex: 'width', valueType: 'digit', width: 100, fieldProps: { variant: 'filled' } },
                // 面积带尾部单位
                { title: '面积', dataIndex: 'area', valueType: 'digit', width: 140, fieldProps: { addonAfter: '㎡', style: { width: '100%' }, variant: 'filled' } },
                // 金额类
                { title: '单价', dataIndex: 'unitPrice', valueType: 'money', width: 140, fieldProps: { style: { width: '100%' }, variant: 'filled' } },
                { title: '合计', dataIndex: 'totalAmount', valueType: 'money', width: 140, fieldProps: { style: { width: '100%' }, variant: 'filled' } },

                actionColumn,
            ];
        }
        // 4.2 广告费用申请单(户外大牌) - 专属表格
        if (type === 'ad_billboard') {
            return [
                { title: '项目名称', dataIndex: 'projectName', valueType: 'text', width: 180, fieldProps: { variant: 'filled' } },
                { title: '材质', dataIndex: 'material', valueType: 'text', width: 160, fieldProps: { variant: 'filled' } },
                // 拆分长宽
                { title: '长(m)', dataIndex: 'length', valueType: 'digit', width: 100, fieldProps: { variant: 'filled' } },
                { title: '宽(m)', dataIndex: 'width', valueType: 'digit', width: 100, fieldProps: { variant: 'filled' } },
                // 面积带尾部单位
                { title: '面积', dataIndex: 'area', valueType: 'digit', width: 140, fieldProps: { addonAfter: '㎡', style: { width: '100%' }, variant: 'filled' } },
                // 金额类
                { title: '单价', dataIndex: 'unitPrice', valueType: 'money', width: 140, fieldProps: { style: { width: '100%' }, variant: 'filled' } },
                { title: '合计', dataIndex: 'totalAmount', valueType: 'money', width: 140, fieldProps: { style: { width: '100%' }, variant: 'filled' } },

                actionColumn,
            ];
        }

        return [];
    };

    return (
        <PageContainer>
            <ProForm
                submitter={{
                    searchConfig: { submitText: '提交', resetText: '保存暂存' },
                    render: (_, dom) => (
                        <FooterToolbar extra={<Button style={{ color: '#8c8c8c' }}>退出</Button>}>
                            <Button color="primary" variant="outlined">顾问确认</Button>
                            <Button color="primary" variant="outlined">项目补录</Button>
                            <Button color="primary" variant="outlined">下推</Button>
                            <div style={{ width: 16, display: 'inline-block' }} />
                            {dom}
                        </FooterToolbar>
                    ),
                }}
            >
                {/* ===================================================================== */}
                {/* 模块一：费用申请单（你的原有逻辑，增加了 7 种类型选择） */}
                {/* ===================================================================== */}
                <Card title="费用申请单" bordered={false} style={{ marginBottom: 16, borderRadius: 8 }}>
                    <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: '64px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Avatar size={54} icon={<UserOutlined />} src="https://api.dicebear.com/7.x/notionists/svg?seed=Wanping" style={{ backgroundColor: '#1677ff' }} />
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontSize: 18, fontWeight: 600, color: '#1f1f1f' }}>张婉萍</span>
                                    <Button size="small" icon={<SwapOutlined />} style={{ fontSize: 12, color: '#1677ff', borderColor: '#91caff' }}>切换</Button>
                                </div>
                                <Text type="secondary" style={{ fontSize: 13 }}>15280666666</Text>
                            </div>
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 13 }}>安井集团</Text>
                            <div style={{ fontSize: 14, color: '#1f1f1f', marginBottom: 4, fontWeight: 500 }}>快消通部 | 快消通部职员</div>
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 13 }}>单据编号</Text>
                            <div style={{ fontSize: 14, color: '#1f1f1f', marginBottom: 4, fontWeight: 500 }}>SQD2608141602</div>
                        </div>
                    </div>

                    <Row gutter={[64, 8]}>
                        {/*第一类*/}
                        <Col flex="100%">
                            <Title level={5}>基本信息</Title>
                        </Col>
                        <Col flex="20%"><ProFormDatePicker fieldProps={{ variant: 'filled' }} name="applyDate" label="申请日期" placeholder="请选择" width="100%" rules={[{ required: true }]} /></Col>
                        <Col flex="20%">
                            <ProFormText name="region" label="费用承担部门" placeholder="请选择或输入" rules={[{ required: true }]}
                                         fieldProps={{
                                             variant: 'filled',
                                             autoComplete: 'off',
                                             onClick: () => setIsDeptModalOpen(true),
                                             suffix: (
                                                 <PartitionOutlined
                                                     style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         setIsDeptModalOpen(true);
                                                     }}
                                                 />
                                             )
                                         }}
                            />
                        </Col>
                        <Col flex="20%">
                            <ProFormText name="region" label="费用支付公司" placeholder="请选择或输入" rules={[{ required: true }]}
                                         fieldProps={{
                                             variant: 'filled',
                                             autoComplete: 'off',
                                             onClick: () => setIsDeptModalOpen(true),
                                             suffix: (
                                                 <PartitionOutlined
                                                     style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         setIsDeptModalOpen(true);
                                                     }}
                                                 />
                                             )
                                         }}
                            />
                        </Col>
                        <Col flex="20%"><ProFormText name="company" label="费用承担公司" initialValue="安井食品集团股份有限公司" rules={[{ required: true }]} disabled fieldProps={{ variant: 'filled' }} /></Col>

                        <Col flex="20%">
                            {/* 🌟 核心控制开关：7种申请单类型 */}
                            <ProFormSelect
                                name="expenseType"
                                label="费用申请类型"
                                placeholder="请选择"
                                initialValue="daily"
                                rules={[{ required: true }]}
                                fieldProps={{ variant: 'filled', onChange: (value) => setCurrentExpenseType(value) }}
                                options={[
                                    { label: '日常费用', value: 'daily' },

                                    { label: '报告呈送单', value: 'marketing_report' },
                                    { label: '商超审批单', value: 'supermarket_approval' },
                                    { label: '卖场商超新品进场审批单', value: 'new_product_entry' },
                                    { label: '广告费用申请单', value: 'ad_expense' },
                                    { label: '广告费用申请单(户外大牌)', value: 'ad_billboard' },
                                ]}
                            />
                        </Col>
                        <Col flex="100%">
                            <ProFormTextArea name="reason" label="主题/事由" placeholder="请输入主题/事由" rules={[{ required: true }]} fieldProps={{variant: 'filled', autoSize: { minRows: 3, maxRows: 5 }}}/>
                        </Col>

                        {/*第三类*/}
                        <Col flex="100%">
                            <Title level={5}>结算信息</Title>
                        </Col>
                        <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }} name="receiveType" label="收款类型" placeholder="请选择" rules={[{ required: true }]} /></Col>
                        <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="receiverName" label="收款人" placeholder="请输入" rules={[{ required: true }]} /></Col>
                        <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }} name="payType" label="支付类型" placeholder="请选择" rules={[{ required: true }]} /></Col>

                        <Col flex="20%"><ProFormText name="currency" label="本位币" initialValue="人民币" rules={[{ required: true }]} disabled fieldProps={{ variant: 'filled' }} /></Col>
                        <Col flex="20%"><ProFormSwitch name="multiCurrency" label="多币种" /></Col>

                        <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }} name="payMethod" label="结算方式" placeholder="请选择" options={[{ label: '电汇', value: 'wire' }]} rules={[{ required: true }]} /></Col>
                        <Col flex="20%"><ProFormSwitch name="isPrepay" label="预付" /></Col>
                        {/*第四类*/}
                        <Col flex="100%">
                            <Title level={5}>合同相关信息</Title>
                        </Col>
                        <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }} name="contractType" label="合同类型" placeholder="请选择" options={[{ label: '合同', value: 'contract' }]} /></Col>
                        <Col flex="20%">
                            <ProFormText
                                name="contractNo"
                                label="合同号"
                                placeholder="请选择" // 🌟 修改点 1：精简占位符，直奔主题
                                fieldProps={{
                                    variant: 'filled',
                                    autoComplete: 'off',
                                    readOnly: true, // 🌟 修改点 2：增加只读属性，彻底屏蔽键盘输入，但保留交互活性
                                    style: { cursor: 'pointer' }, // 🌟 修改点 3：给整个输入框加上小手光标，暗示全局可点击
                                    onClick: () => setIsDeptModalOpen(true),
                                    suffix: (
                                        <ProfileOutlined
                                            style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDeptModalOpen(true);
                                            }}
                                        />
                                    )
                                }}
                            />
                        </Col>
                        <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="contractSettle" label="合同结算方式" placeholder="关联合同带出" disabled={true} /></Col>
                        <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="supplier" label="供应商" placeholder="请输入" /></Col>
                        <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }} name="ContractStatus" label="合同状态" placeholder="请选择"  /></Col>

                        {/*第五类*/}
                        <Col flex="100%">
                            <Title level={5}>费用相关信息</Title>
                        </Col>
                        <Col flex="20%">
                            <ProFormText name="region" label="归属区域" placeholder="请选择或输入"
                                         fieldProps={{
                                             variant: 'filled',
                                             // 🌟 加上这行，明确告诉浏览器：不要给我弹自动填充！
                                             autoComplete: 'off',
                                             onClick: () => setIsDeptModalOpen(true),
                                             suffix: (
                                                 <ProfileOutlined
                                                     style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         setIsDeptModalOpen(true);
                                                     }}
                                                 />
                                             )
                                         }}
                            />
                        </Col>
                        <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="biCustomerType" label="BI客户类别" placeholder="销售订单带出" disabled={true} /></Col>
                        <Col flex="20%">
                            <ProFormText name="region" label="客户（导入数据用）" placeholder="请选择或输入"
                                         fieldProps={{
                                             variant: 'filled',
                                             autoComplete: 'off',
                                             onClick: () => setIsDeptModalOpen(true),
                                             suffix: (
                                                 <ProfileOutlined
                                                     style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                     onClick={(e) => {
                                                         e.stopPropagation();
                                                         setIsDeptModalOpen(true);
                                                     }}
                                                 />
                                             )
                                         }}
                            />
                        </Col>
                        <Col flex="20%"><ProFormSwitch name="isRef" label="是否应收单引用" disabled /></Col>
                        <Col flex="20%"><ProFormSwitch name="isImport" label="是否导入单据" /></Col>
                        <Col flex="20%"><ProFormSwitch name="isInit" label="初始化单据" disabled /></Col>

                        {/*<Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="receiverControlNo" label="费控单号" disabled={true} /></Col>*/}
                        {/*<Col flex="20%"><ProFormSwitch name="isArchive" label="归档" disabled /></Col>*/}
                        {/*<Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="archiver" label="归档人" disabled={true} /></Col>*/}
                        {/*<Col flex="20%"><ProFormSwitch name="isLetter" label="费用函" disabled /></Col>*/}

                    </Row>
                </Card>
                {/* ===================================================================== */}
                {/* 模块二：申请信息（现在移到了费用明细的下方） */}
                {/* ===================================================================== */}
                <Card title="申请信息" bordered={false} style={{ marginBottom: 16, borderRadius: 8 }}>

                    {/* 1. 日常费用 (默认) -> 仅空状态 */}
                    {currentExpenseType === 'daily' && (
                        <div style={{ padding: '0' }}>
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />
                        </div>
                    )}



                    {/* 3.1 报告呈送单 -> 高级表单 + 表格 (表格在公共区域渲染) */}
                    {currentExpenseType === 'marketing_report' && (
                        <div style={{ padding: '8px 0', marginBottom: 0 }}>
                            <Row gutter={[64, 8]}>
                                <Col flex="100%">
                                    <ProFormTextArea name="report-1" label="报告内容" placeholder="请输入" rules={[{ required: true }]} fieldProps={{variant: 'filled', autoSize: { minRows: 3, maxRows: 5 }}}/>
                                </Col>
                                <Col flex="100%">
                                    {/* level={5} 对应的是字号大小，数值越小字越大，5 刚好是 16px 左右的加粗标题 */}
                                    <Title level={5}>流程参与人</Title>
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="驻外内务 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="KA经理 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="部门主管/主任 " placeholder="请选择或输入 " rules={[{ required: true }]}
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="部门主管1 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="分管审核 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="分管审核1 " placeholder="请选择或输入分"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="分管领导 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="分管领导1 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="分管总监 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="分管总监1 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>

                                <Col flex="20%">
                                    <ProFormText name="process1" label="集团副总 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="集团总经理 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="process1" label="集团董事长 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>

                            </Row>
                        </div>
                    )}

                    {/* 3.2 商超审批单 -> 高级表单 + 表格 (表格在公共区域渲染) */}
                    {currentExpenseType === 'supermarket_approval' && (
                        <div style={{ padding: '8px 0' }}>
                            <Row gutter={[64, 8]}>
                                <Col flex="20%"><ProFormText name="supermarketField1" label="门店" placeholder="请选择" fieldProps={{ variant: 'filled', readOnly: true, suffix: <ProfileOutlined style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }} onClick={(e) => { e.stopPropagation(); setIsDeptModalOpen(true); }} />, onClick: () => setIsDeptModalOpen(true), style: { cursor: 'pointer' } }} /></Col>
                                <Col flex="20%"><ProFormText name="supermarketField1" label="系统课别" placeholder="请选择" fieldProps={{ variant: 'filled', readOnly: true, suffix: <ProfileOutlined style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }} onClick={(e) => { e.stopPropagation(); setIsDeptModalOpen(true); }} />, onClick: () => setIsDeptModalOpen(true), style: { cursor: 'pointer' } }} /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="supermarketField1" label="上年度销售总额" placeholder="请输入" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="supermarketField1" label="上年度费用金额" placeholder="请输入" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="supermarketField1" label="上年度盈亏金额" placeholder="请输入"/></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="supermarketField1" label="上年度盈亏比例" placeholder="请输入"/></Col>

                                <Col flex="100%">
                                    <ProFormTextArea name="report-2" label="报告内容" placeholder="请输入" rules={[{ required: true }]} fieldProps={{variant: 'filled', autoSize: { minRows: 3, maxRows: 5 }}}/>
                                </Col>
                                <Col flex="100%">
                                    {/* level={5} 对应的是字号大小，数值越小字越大，5 刚好是 16px 左右的加粗标题 */}
                                    <Title level={5}>审批人员</Title>
                                </Col>

                                <Col flex="20%">
                                    <ProFormText name="supermarketField1" label="驻外内务 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="supermarketField1" label="KA经理 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="supermarketField1" label="部门主管/主任 " placeholder="请选择或输入" rules={[{ required: true }]}
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="supermarketField1" label="部门主管1 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="supermarketField1" label="本部审核 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="supermarketField1" label="分管领导 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="supermarketField1" label="分管领导1 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="supermarketField1" label="分管总监 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%">
                                    <ProFormText name="supermarketField1" label="分管总监1 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>



                            </Row>
                        </div>
                    )}



                    {/* 4.1 广告费用申请单 -> 顶部现有表单 + 表格 (公共区) + 底部表单 */}
                    {currentExpenseType === 'ad_expense' && (
                        <div style={{ padding: '8px 0' }}>
                            <Row gutter={[64, 8]}>
                                <Col flex="20%">
                                    <ProFormText name="ad_expense1" label="客户名称 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_expense4" label="制作公司名称" rules={[{ required: true }]} /></Col>
                                <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }}  label="客户类型" name="ad_expense5" placeholder="请选择"  /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_expense6" label="负责人"  rules={[{ required: true }]}/></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_expense7" label="联系电话"  rules={[{ required: true }]}/></Col>

                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_expense8" label="客户销售品项数"  rules={[{ required: true }]}/></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_expense9" label="预计年销售额"  rules={[{ required: true }]}/></Col>
                                <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }}  label="费用类型" name="ad_expense10" placeholder="请选择" rules={[{ required: true }]} /></Col>
                                <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }}  label="申请类型" name="ad_expense12" placeholder="请选择" rules={[{ required: true }]} /></Col>
                                <Col flex="20%"><ProFormDatePicker fieldProps={{ variant: 'filled' }} name="ad_expense13" label="预计开始日期" width="100%" placeholder="请选择" /></Col>
                                <Col flex="20%"><ProFormDatePicker fieldProps={{ variant: 'filled' }} name="ad_expense14" label="预计结束日期" width="100%" placeholder="请选择" /></Col>
                                <Col flex="100%">
                                    <Title level={5}>制作内容</Title>
                                </Col>
                                <Col flex="20%">
                                    <ProFormTextArea name="ad-location-1" label="发布地点" placeholder="请输入" rules={[{ required: true }]} fieldProps={{variant: 'filled', autoSize: { minRows: 3, maxRows: 5 }}}/>
                                </Col>
                                <Col flex="40%">
                                    <ProFormTextArea name="ad-condition-1" label="广告位情况" placeholder="请输入" rules={[{ required: true }]} fieldProps={{variant: 'filled', autoSize: { minRows: 3, maxRows: 5 }}}/>
                                </Col>
                                <Col flex="40%">
                                    <ProFormTextArea name="ad-significance-1" label="发布意义" placeholder="请输入" rules={[{ required: true }]} fieldProps={{variant: 'filled', autoSize: { minRows: 3, maxRows: 5 }}}/>
                                </Col>




                            </Row>
                        </div>
                    )}

                    {/* 4.2 广告费用申请单(户外大牌) -> 顶部现有表单 + 表格 (公共区) + 底部表单 */}
                    {currentExpenseType === 'ad_billboard' && (
                        <div style={{ padding: '8px 0', }}>
                            <Row gutter={[64, 8]}>
                                <Col flex="20%">
                                    <ProFormText name="ad_billboard2" label="客户名称 " placeholder="请选择或输入"
                                                 fieldProps={{
                                                     variant: 'filled',
                                                     autoComplete: 'off',
                                                     onClick: () => setIsDeptModalOpen(true),
                                                     suffix: (
                                                         <ProfileOutlined
                                                             style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }}
                                                             onClick={(e) => {
                                                                 e.stopPropagation();
                                                                 setIsDeptModalOpen(true);
                                                             }}
                                                         />
                                                     )
                                                 }}
                                    />
                                </Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard4" label="制作公司名称" rules={[{ required: true }]} /></Col>
                                <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }}  label="客户类型" name="ad_billboard5" placeholder="请选择"  /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard6" label="负责人"  rules={[{ required: true }]}/></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard7" label="联系电话"  rules={[{ required: true }]}/></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard8" label="客户销售品项数"  rules={[{ required: true }]}/></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard9" label="预计年销售额"  rules={[{ required: true }]}/></Col>
                                <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }}  label="费用类型" name="ad_billboard10" placeholder="请选择" rules={[{ required: true }]} /></Col>
                                <Col flex="20%"><ProFormSelect fieldProps={{ variant: 'filled' }}  label="申请类型" name="ad_billboard12" placeholder="请选择" rules={[{ required: true }]} /></Col>
                                <Col flex="20%"><ProFormDatePicker fieldProps={{ variant: 'filled' }} name="ad_billboard13" label="预计开始日期" width="100%"  /></Col>
                                <Col flex="20%"><ProFormDatePicker fieldProps={{ variant: 'filled' }} name="ad_billboard14" label="预计结束日期" width="100%"  /></Col>
                                <Col flex="100%">
                                    <Title level={5}>制作内容</Title>
                                </Col>
                                <Col flex="20%">
                                    <ProFormTextArea name="ad-location-2" label="发布地点" placeholder="请输入" rules={[{ required: true }]} fieldProps={{variant: 'filled', autoSize: { minRows: 3, maxRows: 5 }}}/>
                                </Col>
                                <Col flex="40%">
                                    <ProFormTextArea name="ad-condition-2" label="广告位情况" placeholder="请输入" rules={[{ required: true }]} fieldProps={{variant: 'filled', autoSize: { minRows: 3, maxRows: 5 }}}/>
                                </Col>
                                <Col flex="40%">
                                    <ProFormTextArea name="ad-significance-2" label="发布意义" placeholder="请输入" rules={[{ required: true }]} fieldProps={{variant: 'filled', autoSize: { minRows: 3, maxRows: 5 }}}/>
                                </Col>

                            </Row>
                        </div>
                    )}

                    {/* 🌟 公共表格区：只要不是“日常”和“行政”，都会渲染这个表格，列配置去 getDynamicColumns 取 */}
                    {['supermarket_approval', 'new_product_entry', 'ad_expense', 'ad_billboard'].includes(currentExpenseType) && (
                        <div>
                            <EditableProTable
                                headerTitle="明细录入"
                                rowKey="id"
                                name="expenseDetails"
                                initialValue={defaultData}
                                scroll={{ x: 1200 }}
                                locale={{
                                    emptyText: (
                                        <Empty
                                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                                            description="暂无明细数据"
                                            // 这里的 margin 用来精确控制上下间距，数值你可以随意调小（比如 8px 0）
                                            style={{ margin: '6px 0' }}
                                        />
                                    )
                                }}

                                columns={getDynamicColumns(currentExpenseType)}
                                editable={{
                                    type: 'multiple',
                                    editableKeys,
                                    onChange: setEditableRowKeys,
                                    actionRender: (row, config, defaultDom) => [
                                        defaultDom.save,
                                        defaultDom.delete,
                                        defaultDom.cancel,
                                        <a key="copy" onClick={() => console.log('复制当前行：', row)}>复制行</a>,
                                    ],
                                }}
                                toolBarRender={() => [
                                    <Button key="batch" type="link" onClick={() => console.log('批量填充')}>批量填充</Button>,
                                    <Button key="import" type="link" onClick={() => console.log('导入行')}>导入行</Button>,
                                ]}
                                options={{ fullScreen: true, reload: false, setting: true }}
                                recordCreatorProps={{
                                    position: 'bottom',
                                    record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                                    creatorButtonText: '新增明细行',
                                }}
                            />
                        </div>
                    )}

                    {/* 4.1 广告费用申请单 -> 底部专属表单 */}
                    {currentExpenseType === 'ad_expense' && (
                        <div style={{ padding: '24px 0 8px 0', marginTop: 24, borderTop: '1px dashed #e8e8e8' }}>
                            <Row gutter={[64, 8]}>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="adBottomField2" label="发票类型" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="adBottomField2" label="年度已报销金额（联络处）" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="adBottomField2" label="年度已申请金额（客户）" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="adBottomField2" label="年度预算（联络处）" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="adBottomField2" label="年度已申请金额（联络处）" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="adBottomField2" label="已用占比（联络处）" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="adBottomField2" label="年度余额（联络处）" /></Col>
                            </Row>
                        </div>
                    )}

                    {/* 4.2 广告费用申请单(户外大牌) -> 底部专属表单 */}
                    {currentExpenseType === 'ad_billboard' && (
                        <div style={{ padding: '24px 0 8px 0', marginTop: 24, borderTop: '1px dashed #e8e8e8' }}>
                            <Row gutter={[64, 8]}>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard" label="发票类型" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard" label="年度已报销金额（联络处）" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard" label="年度已申请金额（客户）" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard" label="年度预算（联络处）" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard" label="年度已申请金额（联络处）" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard" label="已用占比（联络处）" /></Col>
                                <Col flex="20%"><ProFormText fieldProps={{ variant: 'filled' }} name="ad_billboard" label="年度余额（联络处）" /></Col>
                            </Row>
                        </div>
                    )}
                </Card>


                {/* ===================================================================== */}
                {/* 🌟 调整顺序 1：费用明细 卡片（现在放在附件上方） */}
                {/* ===================================================================== */}
                <Card title="费用明细" bordered={false} style={{ marginBottom: 16, borderRadius: 8  }}  styles={{ body: { paddingTop: 8 } }} >
                    <EditableProTable
                        rowKey="id"
                        name="expenseDetailsTable"
                        columns={expenseColumns}
                        scroll={{ x: 2800 }}
                        locale={{
                            emptyText: (
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description="暂无明细数据"
                                    style={{ margin: '6px 0' }}
                                />
                            )
                        }}
                        recordCreatorProps={{
                            position: 'bottom',
                            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                            creatorButtonText: '新增明细行',
                        }}
                        editable={{
                            type: 'multiple',
                            actionRender: (row, config, defaultDom) => [
                                defaultDom.save,
                                defaultDom.delete,
                                defaultDom.cancel,
                                <a key="copy" onClick={() => console.log('复制当前行：', row)}>复制行</a>,
                            ],
                        }}
                        toolBarRender={() => [
                            <Button key="batch" type="link">批量填充</Button>,
                            <Button key="import" type="link">导入行</Button>,
                        ]}
                        options={{ fullScreen: true, reload: false, setting: true }}

                        // 👇 从这里开始：新增的合计行逻辑
                        summary={(pageData) => {
                            // 🌟 只有当行数大于等于 2 时，才显示合计行
                            if (pageData.length < 2) return null;

                            // 计算原币申请金额的总和
                            let totalAmount = 0;
                            pageData.forEach((row) => {
                                // 确保转换成数字，如果是空值则当 0 处理
                                totalAmount += Number(row.originalAmount) || 0;
                            });

                            return (
                                // 🌟 背景改为极浅的蓝色 (Ant Design primary-1)
                                <Table.Summary.Row style={{ backgroundColor: '#e6f4ff' }}>
                                    <Table.Summary.Cell index={0} colSpan={2} align="center">
                                        <strong style={{ color: '#333' }}>合计</strong>
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell index={1}>
                                        {/* 🌟 文字改为品牌标准蓝 (Ant Design primary-6) */}
                                        <strong style={{ color: '#1677ff', fontSize: '15px' }}>
                                            ¥ {totalAmount.toFixed(2)}
                                        </strong>
                                    </Table.Summary.Cell>

                                    <Table.Summary.Cell index={2} colSpan={19} />
                                </Table.Summary.Row>
                            );
                        }}
                        // 👆 合计行逻辑结束
                    />
                </Card>

                <style>{`
        .compact-toolbar-table .ant-pro-table-list-toolbar-container {
            padding-top: 0 !important;
            padding-bottom: 8px !important;
        }
        
        /* 🌟 100% 像素级复刻官方的必填星号伪元素 */
        .table-header-required::before {
            display: inline-block;
            margin-inline-end: 4px;
            color: #ff4d4f;
            font-size: 14px;
            font-family: SimSun, sans-serif;
            line-height: 1;
            content: "*";
        }
    `}</style>






                {/* ===================================================================== */}
                {/* 模块四：附件（保持不变） */}
                {/* ===================================================================== */}
                <Card title={
                    <Space>
                        附件
                        <Tooltip title="附件数超过30个请以压缩包的方式添加附件；单个附件大小如果超过40M，请使用分卷压缩后上传。">
                            <ExclamationCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)', cursor: 'pointer', fontWeight: 'normal' }} />
                        </Tooltip>
                    </Space>
                }
                      bordered={false}
                      style={{ marginBottom: 54, borderRadius: 8 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <Upload><Button icon={<UploadOutlined />}>上传文件</Button></Upload>
                        <span style={{ color: '#8c8c8c', fontSize: '14px' }}>支持ctrl+v粘贴截图</span>
                    </div>
                    <ProFormUploadDragger name="attachments" label="" icon={<PlusOutlined style={{ fontSize: '24px', color: '#8c8c8c' }} />} title="点击或拖拽上传" description={false}
                                          fieldProps={{ listType: 'picture-card', multiple: true, style: { width: '100%', padding: '12px 0', backgroundColor: '#fafafa', border: '1px dashed #d9d9d9' } }}
                    />
                </Card>
            </ProForm>
        </PageContainer>
    );
}