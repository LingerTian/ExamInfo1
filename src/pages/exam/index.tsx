import { useState, useEffect } from 'react';
import { ProTable, Button, message } from '@ant-design/pro-components';
import { DatePicker, Select, Input } from 'antd';
import { useNavigate } from 'umi';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import NewExamModal from '@/components/NewExamModal';
import { getExamList } from '@/services/exam';

const { RangePicker } = DatePicker;

interface Exam {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  participants: number;
}



const ExamPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<Exam[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const intl = useIntl();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const exams = await getExamList();
      setDataSource(exams);
    } catch (error) {
      message.error('获取考试列表失败');
    }
  };

  const handleSave = async (row: Exam) => {
    try {
      // In a real app, you would update the exam via API
      const newData = [...dataSource];
      const index = newData.findIndex(item => row.id === item.id);
      if (index > -1) {
        const item = newData[index];
        // Convert date to string if it's a Dayjs object
        const formattedRow = {
          ...item,
          ...row,
          startTime: typeof row.startTime === 'string' ? row.startTime : row.startTime?.format('YYYY-MM-DD HH:mm') || '',
          endTime: typeof row.endTime === 'string' ? row.endTime : row.endTime?.format('YYYY-MM-DD HH:mm') || '',
        };
        newData.splice(index, 1, formattedRow);
        setDataSource(newData);
        message.success('保存成功');
      } else {
        message.error('未找到该记录');
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleNewExam = async (values: Exam) => {
    try {
      // In a real app, you would create the exam via API
      const newExam = {
        ...values,
        id: dataSource.length + 1,
        startTime: typeof values.startTime === 'string' ? values.startTime : values.startTime?.format('YYYY-MM-DD HH:mm') || '',
        endTime: typeof values.endTime === 'string' ? values.endTime : values.endTime?.format('YYYY-MM-DD HH:mm') || '',
        duration: values.duration || 120,
      };
      setDataSource([...dataSource, newExam]);
      setModalVisible(false);
      message.success('新建考试成功');
    } catch (error) {
      message.error('新建考试失败');
    }
  };

  const handleDistribution = (id: number) => {
    navigate(`/exam/${id}/room-distribution`);
  };

  const columns = [
    {
      title: intl.formatMessage({ id: 'exam.name', defaultMessage: '考试名称' }),
      dataIndex: 'name',
      key: 'name',
      editable: true,
      onFilter: (value: string, record) => record.name.includes(value),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="包含"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.formatMessage({ id: 'common.search', defaultMessage: '查询' })}
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            {intl.formatMessage({ id: 'common.reset', defaultMessage: '重置' })}
          </Button>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'exam.description', defaultMessage: '描述' }),
      dataIndex: 'description',
      key: 'description',
      editable: true,
    },
    {
      title: intl.formatMessage({ id: 'exam.time', defaultMessage: '考试时间' }),
      dataIndex: ['startTime', 'endTime'],
      key: 'time',
      editable: (text, record, index) => ({
        component: (
          <DatePicker 
            showTime
            style={{ width: '100%' }}
            defaultValue={dayjs(record.startTime, 'YYYY-MM-DD HH:mm')}
          />
        ),
      }),
      render: (_, record) => {
        const startTime = dayjs(record.startTime);
        const endTime = dayjs(record.endTime);
        return `${startTime.format('YYYY-MM-DD HH:mm')} - ${endTime.format('HH:mm')}`;
      },
      onFilter: (value: [dayjs.Dayjs, dayjs.Dayjs], record) => {
        const recordTime = dayjs(record.startTime);
        return recordTime.isBetween(value[0], value[1], undefined, '[]');
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <RangePicker
            showTime
            style={{ width: '100%', marginBottom: 8 }}
            value={selectedKeys[0] ? (selectedKeys[0] as [dayjs.Dayjs, dayjs.Dayjs]) : undefined}
            onChange={(dates) => setSelectedKeys(dates ? [dates] : [])}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.formatMessage({ id: 'common.search', defaultMessage: '查询' })}
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            {intl.formatMessage({ id: 'common.reset', defaultMessage: '重置' })}
          </Button>
        </div>
      ),
    },
    {
      title: intl.formatMessage({ id: 'exam.status', defaultMessage: '状态' }),
      dataIndex: 'status',
      key: 'status',
      editable: true,
      filters: [
          { text: intl.formatMessage({ id: 'exam.status.upcoming', defaultMessage: '即将开始' }), value: 'Upcoming' },
          { text: intl.formatMessage({ id: 'exam.status.ongoing', defaultMessage: '进行中' }), value: 'Ongoing' },
          { text: intl.formatMessage({ id: 'exam.status.completed', defaultMessage: '已结束' }), value: 'Completed' },
          { text: intl.formatMessage({ id: 'exam.status.cancelled', defaultMessage: '已取消' }), value: 'Cancelled' },
        ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: intl.formatMessage({ id: 'exam.participants', defaultMessage: '参加考试人数' }),
      dataIndex: 'participants',
      key: 'participants',
      editable: true,
      align: 'right',
    },
    {
      title: intl.formatMessage({ id: 'exam.action', defaultMessage: '操作' }),
      key: 'action',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate(`/exam/${record.id}`)} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'common.detail', defaultMessage: '详情' })}
          </Button>
          <Button type="primary" onClick={() => handleDistribution(record.id)}>
            {intl.formatMessage({ id: 'exam.distribution', defaultMessage: '考场分布' })}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <ProTable<Exam>
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        editable={{
          type: 'cell',
          onSave: handleSave,
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => intl.formatMessage({ id: 'common.total', defaultMessage: '共 {total} 条记录' }, { total }),
        }}
        headerTitle={intl.formatMessage({ id: 'exam.list', defaultMessage: '考试列表' })}
        toolBarRender={() => [
          <Button type="primary" onClick={() => setModalVisible(true)}>
            {intl.formatMessage({ id: 'exam.new', defaultMessage: '新建考试' })}
          </Button>,
        ]}
        options={false}
      />
      <NewExamModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleNewExam}
      />
    </div>
  );
};

export default ExamPage;