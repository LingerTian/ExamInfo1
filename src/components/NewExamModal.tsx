import { ProForm, ProFormText, ProFormSelect, ProFormDigit, ProFormDatePicker } from '@ant-design/pro-components';
import { Modal, Button } from 'antd';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';

interface NewExamModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: (values: any) => void;
}

const NewExamModal: React.FC<NewExamModalProps> = ({ visible, onCancel, onSuccess }) => {
  const intl = useIntl();

  return (
    <Modal
      visible={visible}
      title={intl.formatMessage({ id: 'exam.new', defaultMessage: '新建考试' })}
      onCancel={onCancel}
      footer={null}
      width={500}
    >
      <ProForm
        onFinish={onSuccess}
        submitter={{
          render: (_, dom) => (
            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Button onClick={onCancel} style={{ marginRight: 8 }}>
                {intl.formatMessage({ id: 'common.cancel', defaultMessage: '取消' })}
              </Button>
              <Button type="primary" htmlType="submit">
                {intl.formatMessage({ id: 'common.ok', defaultMessage: '确定' })}
              </Button>
            </div>
          ),
        }}
      >
        <ProFormText
          name="name"
          label={intl.formatMessage({ id: 'exam.name', defaultMessage: '考试名称' })}
          rules={[{ required: true, message: '请输入考试名称' }]}
        />
        <ProFormText
          name="description"
          label={intl.formatMessage({ id: 'exam.description', defaultMessage: '描述' })}
          fieldProps={{ rows: 3 }}
        />
        <ProFormDatePicker.RangePicker
          name={['startTime', 'endTime']}
          label={intl.formatMessage({ id: 'exam.time', defaultMessage: '考试时间' })}
          rules={[{ required: true, message: '请选择考试时间' }]}
          fieldProps={{ showTime: true }}
        />
        <ProFormSelect
          name="status"
          label={intl.formatMessage({ id: 'exam.status', defaultMessage: '状态' })}
          rules={[{ required: true, message: '请选择考试状态' }]}
          options={[
            { value: 'Upcoming', label: intl.formatMessage({ id: 'exam.status.upcoming', defaultMessage: '即将开始' }) },
            { value: 'Ongoing', label: intl.formatMessage({ id: 'exam.status.ongoing', defaultMessage: '进行中' }) },
            { value: 'Completed', label: intl.formatMessage({ id: 'exam.status.completed', defaultMessage: '已结束' }) },
            { value: 'Cancelled', label: intl.formatMessage({ id: 'exam.status.cancelled', defaultMessage: '已取消' }) },
          ]}
        />
        <ProFormDigit
          name="participants"
          label={intl.formatMessage({ id: 'exam.participants', defaultMessage: '参加考试人数' })}
          rules={[
            { required: true, message: '请输入参加考试人数' },
            { min: 1, message: '参加人数不能少于1人' },
          ]}
        />
        <ProFormDigit
          name="duration"
          label={intl.formatMessage({ id: 'exam.duration', defaultMessage: '考试时长（分钟）' })}
          rules={[
            { required: true, message: '请输入考试时长' },
            { min: 30, message: '考试时长不能少于30分钟' },
            { max: 360, message: '考试时长不能超过360分钟' },
          ]}
          initialValue={120}
        />
      </ProForm>
    </Modal>
  );
};

export default NewExamModal;