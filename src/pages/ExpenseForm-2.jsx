import React, { useState } from 'react';
import { Card, Avatar, Typography, Button, Row, Col, Modal, Upload, Tooltip, Space } from 'antd';
// 在大括号里加上 PartitionOutlined
import { UserOutlined, SwapOutlined, ApartmentOutlined, ProfileOutlined, PartitionOutlined, PlusOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
    PageContainer,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormDatePicker,
    ProFormSwitch,
    EditableProTable,
    FooterToolbar,
    ProFormUploadDragger
} from '@ant-design/pro-components';

const { Text } = Typography;

export default function TestPage() {
    const [editableKeys, setEditableRowKeys] = useState([]);

    // 🌟 1. 新增：记录当前选中的“费用申请单类型”
    const [currentExpenseType, setCurrentExpenseType] = useState('daily');

    // 🌟 帮你加的假数据，让表格有内容可以看
    const defaultData = [
        { id: '1', customer: '安井食品', orderNo: 'SQD2608141602', date: '2026-08-01', multiProject: false, project: '1', fundType: '1', amount: 15000, balance: 5000, localBalance: 5000, localUsed: 10000, submitNo: 'SUB260801', downNo: 'DN-101', projectA: 'PRJ-A1', remark: '日常报销' },
        { id: '2', customer: '永辉超市', orderNo: 'SQD2608141603', date: '2026-08-02', multiProject: true, project: '2', fundType: '2', amount: 3200, balance: 1200, localBalance: 1200, localUsed: 2000, submitNo: 'SUB260802', downNo: 'DN-102', projectA: 'PRJ-A2', remark: '物料采购' },
    ];

    // 🌟 帮你加了一大堆列，确保它超过屏幕宽度产生滚动条
    const columns = [
        { title: '费用客户', dataIndex: 'customer', valueType: 'text', width: 140 },
        { title: '单据单号', dataIndex: 'orderNo', valueType: 'text', width: 160 },
        { title: '归属日期', dataIndex: 'date', valueType: 'date', width: 130 },
        { title: '多项目模式', dataIndex: 'multiProject', valueType: 'switch', width: 120 },
        { title: '预算项目', dataIndex: 'project', valueType: 'select', valueEnum: { '1': '常规项目', '2': '研发项目' }, width: 140 },
        { title: '资金来源类型', dataIndex: 'fundType', valueType: 'select', width: 140 },
        { title: '已申请金额本位币', dataIndex: 'amount', valueType: 'money', width: 160 },
        { title: '可用余额', dataIndex: 'balance', valueType: 'money', width: 140 },
        { title: '本位币可用余额', dataIndex: 'localBalance', valueType: 'money', width: 140 },
        { title: '本位币已用金额', dataIndex: 'localUsed', valueType: 'money', width: 140 },
        { title: '呈送单号', dataIndex: 'submitNo', valueType: 'text', width: 140 },
        { title: '下游单据编码', dataIndex: 'downNo', valueType: 'text', width: 140 },
        { title: '项目号A', dataIndex: 'projectA', valueType: 'text', width: 140 },
        { title: '备注', dataIndex: 'remark', valueType: 'text', width: 180 },
        {
            title: '操作',
            valueType: 'option',
            width: 120,
            fixed: 'right', // 固定在右侧不会跟着滑动
            render: (text, record, _, action) => [
                <a key="editable" onClick={() => action?.startEditable?.(record.id)}>编辑</a>,
            ],
        },
    ];

    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);

    // 🌟 动态获取表头配置的函数（5种类型全覆盖版）
    const getDynamicColumns = (type) => {
        // 提取公共的操作列（包含了你之前加的“复制行”按钮）
        const actionColumn = {
            title: '操作',
            valueType: 'option',
            width: 150,
            fixed: 'right',
            // 保持之前的行内操作按钮逻辑不变
            actionRender: (row, config, defaultDom) => [
                defaultDom.save,
                defaultDom.delete,
                defaultDom.cancel,
                <a key="copy" onClick={() => console.log('复制当前行数据：', row)}>复制行</a>,
            ],
        };

        // 1. 商超费用 (supermarket)
        if (type === 'supermarket') {
            return [
                { title: '商超名称', dataIndex: 'marketName', valueType: 'text', width: 160 },
                { title: '活动档期', dataIndex: 'period', valueType: 'dateRange', width: 200 },
                { title: '陈列费', dataIndex: 'displayFee', valueType: 'money', width: 140 },
                actionColumn, // 👈 记得每一套最后都要拼上这个操作列
            ];
        }

        // 2. 广告费用（广告制作） (ad_production)
        if (type === 'ad_production') {
            return [
                { title: '制作公司', dataIndex: 'companyName', valueType: 'text', width: 180 },
                { title: '物料材质', dataIndex: 'material', valueType: 'text', width: 140 },
                { title: '制作数量', dataIndex: 'count', valueType: 'digit', width: 120 },
                actionColumn,
            ];
        }

        // 3. 广告费用（户外大牌） (ad_billboard)
        if (type === 'ad_billboard') {
            return [
                { title: '大牌位置', dataIndex: 'location', valueType: 'text', width: 180 },
                { title: '投放周期', dataIndex: 'period', valueType: 'dateRange', width: 200 },
                { title: '预估曝光量', dataIndex: 'exposure', valueType: 'digit', width: 140 },
                actionColumn,
            ];
        }

        // 4. 其他特批费用 (other_special)
        if (type === 'other_special') {
            return [
                { title: '特批项目', dataIndex: 'specialProject', valueType: 'text', width: 160 },
                { title: '特批领导', dataIndex: 'leader', valueType: 'text', width: 140 },
                { title: '特批文件号', dataIndex: 'docNo', valueType: 'text', width: 180 },
                actionColumn,
            ];
        }

        // 5. 默认场景：日常费用 (daily) —— 当没有任何匹配时，默认展示这个
        return [
            { title: '费用客户', dataIndex: 'customer', valueType: 'text', width: 140 },
            { title: '单据单号', dataIndex: 'orderNo', valueType: 'text', width: 160 },
            { title: '归属日期', dataIndex: 'date', valueType: 'date', width: 130 },
            { title: '多项目模式', dataIndex: 'multiProject', valueType: 'switch', width: 120 },
            { title: '预算项目', dataIndex: 'project', valueType: 'select', valueEnum: { '1': '常规项目', '2': '研发项目' }, width: 140 },
            { title: '资金来源类型', dataIndex: 'fundType', valueType: 'select', width: 140 },
            { title: '已申请金额本位币', dataIndex: 'amount', valueType: 'money', width: 160 },
            actionColumn,
        ];
    };

    return (
        <PageContainer>
            <ProForm
                onFinish={async (values) => {
                    console.log('提交的数据:', values);
                }}
                submitter={{
                    searchConfig: { submitText: '提交', resetText: '保存暂存' },
                    render: (_, dom) => (
                        <FooterToolbar
                            extra={
                                <Button style={{ color: '#8c8c8c' }} onClick={() => console.log('点击退出')}>
                                    退出
                                </Button>
                            }
                        >
                            <Button color="primary" variant="outlined" onClick={() => console.log('点击顾问确认')}>
                                顾问确认
                            </Button>
                            <Button color="primary" variant="outlined" onClick={() => console.log('点击项目补录')}>
                                项目补录
                            </Button>
                            <Button color="primary" variant="outlined" onClick={() => console.log('点击下推')}>
                                下推
                            </Button>
                            <div style={{ width: 16, display: 'inline-block' }} />
                            {dom}
                        </FooterToolbar>
                    ),
                }}
            >
                {/* 模块一：基本信息 */}
                <Card title="基本信息" bordered={false} style={{ marginBottom: 16, borderRadius: 8 }}>
                    <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: '64px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Avatar size={54} icon={<UserOutlined />} src="https://api.dicebear.com/7.x/notionists/svg?seed=Wanping" style={{ backgroundColor: '#1677ff' }} />
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontSize: 18, fontWeight: 600, color: '#1f1f1f' }}>张婉萍</span>
                                    <Button size="small" icon={<SwapOutlined />} style={{ fontSize: 12, color: '#1677ff', borderColor: '#91caff' }}>切换</Button>
                                </div>
                                <Text type="secondary" style={{ fontSize: 13 }}>15280566179</Text>
                            </div>
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 13 }}>安井集团</Text>
                            <div style={{ fontSize: 14, color: '#1f1f1f', marginBottom: 4, fontWeight: 500 }}>快消通部 | 快消通部职员</div>
                        </div>
                        <div>
                            <Text type="secondary" style={{ fontSize: 13 }}> 单据编号</Text>
                            <div style={{ fontSize: 14, color: '#1f1f1f', marginBottom: 4, fontWeight: 500 }}>SQD2608141602 </div>
                        </div>
                    </div>

                    <Row gutter={[48, 8]}>
                        <Col flex="20%">
                            <ProFormDatePicker fieldProps={{ variant: 'filled' }} name="applyDate" label="申请日期" width="100%" rules={[{ required: true }]} />
                        </Col>
                        <Col flex="20%">
                            <ProFormText name="dept" label="费用承担部门" placeholder="请选择部门" rules={[{ required: true }]}
                                         fieldProps={{
                                             variant: 'filled',
                                             readOnly: true,
                                             suffix: (
                                                 <PartitionOutlined style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }} onClick={(e) => { e.stopPropagation(); setIsDeptModalOpen(true); }} />
                                             ),
                                             onClick: () => setIsDeptModalOpen(true),
                                             style: { cursor: 'pointer' }
                                         }}
                            />
                        </Col>
                        <Col flex="20%">
                            <ProFormText
                                name="currency"
                                label="本位币"
                                initialValue="人民币"
                                rules={[{ required: true }]}
                                disabled
                                fieldProps={{
                                    variant: 'filled',
                                }}
                            />
                        </Col>
                        <Col flex="20%">
                            <ProFormText name="dept" label="费用支付公司" placeholder="请选择费用支付公司" rules={[{ required: true }]}
                                         fieldProps={{
                                             variant: 'filled',
                                             readOnly: true,
                                             suffix: (
                                                 <PartitionOutlined style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }} onClick={(e) => { e.stopPropagation(); setIsDeptModalOpen(true); }} />
                                             ),
                                             onClick: () => setIsDeptModalOpen(true),
                                             style: { cursor: 'pointer' }
                                         }}
                            />
                        </Col>
                        <Col flex="20%">
                            <ProFormText
                                name="company"
                                label="费用承担公司"
                                initialValue="安井食品集团股份有限公司"
                                rules={[{ required: true }]}
                                disabled
                                fieldProps={{
                                    variant: 'filled',
                                }}
                            />
                        </Col>

                        <Col flex="20%">
                            <ProFormSwitch name="multiCurrency" label="多币种" />
                        </Col>

                        {/* 第二行： */}
                        <Col flex="20%">
                            <ProFormText fieldProps={{ variant: 'filled' }} name="receiver" label="费控单号" placeholder="" disabled={true} />
                        </Col>
                        <Col flex="20%">
                            <ProFormSelect
                                name="expenseType"
                                label="费用申请单类型"
                                placeholder="请选择"
                                initialValue="daily"
                                rules={[{ required: true }]}
                                // 🌟 3.1 增加 onChange 事件，选中值变化时更新状态
                                fieldProps={{
                                    variant: 'filled',
                                    onChange: (value) => setCurrentExpenseType(value)
                                }}
                                options={[
                                    { label: '日常费用', value: 'daily' },
                                    { label: '商超费用', value: 'supermarket' },
                                    { label: '广告费用（广告制作）', value: 'ad_production' },
                                    { label: '广告费用（户外大牌）', value: 'ad_billboard' },
                                    { label: '其他特批费用', value: 'other_special' },
                                ]}
                            />
                        </Col>
                        <Col flex="40%">
                            <ProFormText fieldProps={{ variant: 'filled' }} name="reason" label="事由" placeholder="请输入事由" rules={[{ required: true }]} />
                        </Col>

                        {/* 第三行： */}
                        <Col flex="20%">
                            <ProFormSelect fieldProps={{ variant: 'filled' }} name="receiveType" label="收款类型" placeholder="请选择收款类型" rules={[{ required: true }]} />
                        </Col>
                        <Col flex="20%">
                            <ProFormText fieldProps={{ variant: 'filled' }} name="receiver" label="收款人" placeholder="请输入收款人" rules={[{ required: true }]} />
                        </Col>
                        <Col flex="20%">
                            <ProFormSelect fieldProps={{ variant: 'filled' }} name="payType" label="支付类型" placeholder="请选择支付类型" rules={[{ required: true }]} />
                        </Col>
                        <Col flex="20%">
                            <ProFormSelect fieldProps={{ variant: 'filled' }} name="payMethod" label="支付方式" placeholder="请选择支付方式" options={[{ label: '电汇', value: 'wire' }]} rules={[{ required: true }]} />
                        </Col>
                        <Col flex="20%">
                            <ProFormText fieldProps={{ variant: 'filled' }} name="receiver" label="合同号" placeholder="请输入合同号" />
                        </Col>
                        <Col flex="20%">
                            <ProFormSelect fieldProps={{ variant: 'filled' }} name="payMethod" label="合同类型" placeholder="请选择合同类型" options={[{ label: '合同', value: 'wire' }]} />
                        </Col>

                        {/* 第四行： */}
                        <Col flex="20%">
                            <ProFormText fieldProps={{ variant: 'filled' }} name="receiver" label="合同结算方式" placeholder="" disabled={true} />
                        </Col>
                        <Col flex="20%">
                            <ProFormSwitch name="multiCurrency" label="归档" disabled />
                        </Col>
                        <Col flex="20%">
                            <ProFormText fieldProps={{ variant: 'filled' }} name="receiver" label="归档人" placeholder="" disabled={true} />
                        </Col>
                        <Col flex="20%">
                            <ProFormText name="dept" label="厂编" placeholder="请选择厂编"
                                         fieldProps={{
                                             variant: 'filled',
                                             readOnly: true,
                                             suffix: (
                                                 <ProfileOutlined style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }} onClick={(e) => { e.stopPropagation(); setIsDeptModalOpen(true); }} />
                                             ),
                                             onClick: () => setIsDeptModalOpen(true),
                                             style: { cursor: 'pointer' }
                                         }}
                            />
                        </Col>
                        <Col flex="20%">
                            <ProFormText name="dept" label="归属区域" placeholder="请选择归属区域"
                                         fieldProps={{
                                             variant: 'filled',
                                             readOnly: true,
                                             suffix: (
                                                 <ProfileOutlined style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }} onClick={(e) => { e.stopPropagation(); setIsDeptModalOpen(true); }} />
                                             ),
                                             onClick: () => setIsDeptModalOpen(true),
                                             style: { cursor: 'pointer' }
                                         }}
                            />
                        </Col>
                        <Col flex="20%">
                            <ProFormText name="dept" label="客户（导入数据用）" placeholder="请选择客户"
                                         fieldProps={{
                                             variant: 'filled',
                                             readOnly: true,
                                             suffix: (
                                                 <ProfileOutlined style={{ cursor: 'pointer', color: '#bfbfbf', fontSize: '16px' }} onClick={(e) => { e.stopPropagation(); setIsDeptModalOpen(true); }} />
                                             ),
                                             onClick: () => setIsDeptModalOpen(true),
                                             style: { cursor: 'pointer' }
                                         }}
                            />
                        </Col>

                        {/* 第5行： */}
                        <Col flex="20%">
                            <ProFormSwitch name="multiCurrency" label="是否应收单引用" disabled />
                        </Col>
                        <Col flex="20%">
                            <ProFormSwitch name="multiCurrency" label="预付" />
                        </Col>
                        <Col flex="20%">
                            <ProFormSwitch name="multiCurrency" label="费用函" disabled />
                        </Col>
                        <Col flex="20%">
                            <ProFormText fieldProps={{ variant: 'filled' }} name="receiver" label="BI客户类别" placeholder="" disabled={true} />
                        </Col>
                        <Col flex="20%">
                            <ProFormDatePicker fieldProps={{ variant: 'filled' }} name="applyDate" label="期望付款日期" width="100%" />
                        </Col>
                        <Col flex="20%">
                            <ProFormSwitch name="multiCurrency" label="初始化单据" disabled />
                        </Col>
                        <Col flex="20%">
                            <ProFormSwitch name="multiCurrency" label="是否导入单据" />
                        </Col>
                    </Row>
                </Card>

                {/* 🌟 模块二：修改后的费用明细表格 🌟 */}
                <Card  bordered={false} style={{ marginBottom: 16, borderRadius: 8 }}>
                    <EditableProTable
                        columns={getDynamicColumns(currentExpenseType)}

                        editable={{
                            type: 'multiple',
                            editableKeys,
                            onChange: setEditableRowKeys,
                            // ... actionRender 等
                        }}
                        headerTitle="费用明细"
                        rowKey="id"
                        name="expenseDetails"
                        initialValue={defaultData} // 加载假数据
                        scroll={{ x: 2200 }} // 撑宽表格，强制产生左右滑动
                        toolBarRender={() => [
                            <Button key="batch" type="link" onClick={() => console.log('批量填充')}>批量填充</Button>,
                            <Button key="copy" type="link" onClick={() => console.log('复制行')}>复制行</Button>,
                            <Button key="import" type="link" onClick={() => console.log('导入行')}>导入行</Button>,
                        ]}
                        options={{
                            fullScreen: true, // 开启全屏图标
                            reload: false,
                            setting: true,
                        }}
                        recordCreatorProps={{
                            position: 'bottom',
                            record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
                            creatorButtonText: '新增明细行',
                        }}

                        editable={{
                            type: 'multiple',
                            editableKeys,
                            onChange: setEditableRowKeys,
                        }}
                    />
                </Card>

                {/* 模块三：附件 */}
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
                        <Upload>
                            <Button icon={<UploadOutlined />}>上传文件</Button>
                        </Upload>
                        <span style={{ color: '#8c8c8c', fontSize: '14px' }}>支持ctrl+v粘贴截图</span>
                    </div>

                    <ProFormUploadDragger name="attachments" label="" icon={<PlusOutlined style={{ fontSize: '24px', color: '#8c8c8c' }} />} title="点击或拖拽上传" description={false}
                                          fieldProps={{
                                              listType: 'picture-card', multiple: true,
                                              style: {
                                                  width: '100%',
                                                  padding: '12px 0',
                                                  backgroundColor: '#fafafa',
                                                  border: '1px dashed #d9d9d9',
                                              }
                                          }}
                    />
                </Card>
            </ProForm>
        </PageContainer>
    );
}