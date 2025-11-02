import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'umi';
import { useIntl } from 'react-intl';
import { Card, Button, Form, Input, Select, DatePicker, TimePicker, Space, Tag, message, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { Exam } from './index';
import type { FormInstance } from 'antd/es/form';
import dayjs from 'dayjs';

const { Option } = Select;

const ExamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const intl = useIntl();
  const [form] = Form.useForm<Exam>();
  const [exam, setExam] = useState<Exam | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Mock exam data
  const mockExam: Exam = {
    id: parseInt(id || '1'),
    name: '数学期末考试',
    description: '这是一场重要的数学期末考试，涵盖所有学期内容。',
    startTime: new Date('2023-12-20T09:00:00'),
    endTime: new Date('2023-12-20T11:30:00'),
    duration: 150,
    status: 'Upcoming',
    participants: 156,
  };

  useEffect(() => {
    // In a real app, you would fetch the exam data from an API
    setExam(mockExam);
    form.setFieldsValue({
      ...mockExam,
      startTime: dayjs(mockExam.startTime),
      endTime: dayjs(mockExam.endTime),
    });
  }, [id, form]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.setFieldsValue({
      ...exam,
      startTime: dayjs(exam?.startTime),
      endTime: dayjs(exam?.endTime),
    });
  };

  const handleSave = async (values: Exam) => {
    // In a real app, you would save the changes to an API
    message.success(intl.formatMessage({ id: 'exam.detail.save.success', defaultMessage: '考试信息保存成功' }));
    setIsEditing(false);
    setExam(values);
  };

  const handleDelete = () => {
    // In a real app, you would delete the exam from an API
    message.success(intl.formatMessage({ id: 'exam.detail.delete.success', defaultMessage: '考试已删除' }));
    navigate('/exam');
  };

  const getStatusTagColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'blue';
      case 'Ongoing':
        return 'green';
      case 'Completed':
        return 'gray';
      case 'Cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (!exam) {
    return <div>{intl.formatMessage({ id: 'exam.detail.loading', defaultMessage: '加载中...' })}</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/exam')}
          style={{ marginRight: '16px' }}
        >
          {intl.formatMessage({ id: 'common.back', defaultMessage: '返回' })}
        </Button>
        <h1 style={{ display: 'inline-block', margin: 0 }}>
          {intl.formatMessage({ id: 'exam.detail.title', defaultMessage: '考试详情' })}
        </h1>
      </div>

      <Card title={exam.name} bordered={false} style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Tag color={getStatusTagColor(exam.status)}>
            {intl.formatMessage({ id: `exam.status.${exam.status}`, defaultMessage: exam.status })}
          </Tag>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={exam}
          disabled={!isEditing}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={intl.formatMessage({ id: 'exam.name', defaultMessage: '考试名称' })}
                rules={[{ required: true, message: intl.formatMessage({ id: 'exam.name.required', defaultMessage: '请输入考试名称' }) }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="status"
                label={intl.formatMessage({ id: 'exam.status', defaultMessage: '考试状态' })}
              >
                <Select>
                  <Option value="Upcoming">{intl.formatMessage({ id: 'exam.status.upcoming', defaultMessage: '即将开始' })}</Option>
                  <Option value="Ongoing">{intl.formatMessage({ id: 'exam.status.ongoing', defaultMessage: '进行中' })}</Option>
                  <Option value="Completed">{intl.formatMessage({ id: 'exam.status.completed', defaultMessage: '已结束' })}</Option>
                  <Option value="Cancelled">{intl.formatMessage({ id: 'exam.status.cancelled', defaultMessage: '已取消' })}</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="startTime"
                label={intl.formatMessage({ id: 'exam.startTime', defaultMessage: '开始时间' })}
                rules={[{ required: true, message: intl.formatMessage({ id: 'exam.startTime.required', defaultMessage: '请选择开始时间' }) }]}
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="endTime"
                label={intl.formatMessage({ id: 'exam.endTime', defaultMessage: '结束时间' })}
                rules={[{ required: true, message: intl.formatMessage({ id: 'exam.endTime.required', defaultMessage: '请选择结束时间' }) }]}
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="description"
                label={intl.formatMessage({ id: 'exam.description', defaultMessage: '考试描述' })}
              >
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>

          {isEditing ? (
            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={handleCancelEdit} icon={<CloseOutlined />}>
                  {intl.formatMessage({ id: 'common.cancel', defaultMessage: '取消' })}
                </Button>
                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                  {intl.formatMessage({ id: 'common.save', defaultMessage: '保存' })}
                </Button>
              </Space>
            </Form.Item>
          ) : (
            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button danger onClick={handleDelete} icon={<DeleteOutlined />}>
                  {intl.formatMessage({ id: 'common.delete', defaultMessage: '删除' })}
                </Button>
                <Button type="primary" onClick={handleEdit} icon={<EditOutlined />}>
                  {intl.formatMessage({ id: 'common.edit', defaultMessage: '编辑' })}
                </Button>
              </Space>
            </Form.Item>
          )}
        </Form>
      </Card>

      <Card title={intl.formatMessage({ id: 'exam.detail.statistics', defaultMessage: '考试统计' })} bordered={false}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{exam.participants}</div>
              <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'exam.detail.participants', defaultMessage: '参加人数' })}</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{exam.duration}</div>
              <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'exam.detail.duration', defaultMessage: '考试时长 (分钟)' })}</div>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>85%</div>
              <div style={{ color: '#666' }}>{intl.formatMessage({ id: 'exam.detail.attendance', defaultMessage: '预计出勤率' })}</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ExamDetail;