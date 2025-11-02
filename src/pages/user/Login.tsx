import { ProForm, ProFormText, ProFormSubmitButton } from '@ant-design/pro-components';
import { Card, Form } from 'antd';
import { useNavigate } from 'umi';
import { useIntl } from 'react-intl';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [form] = Form.useForm();

  const handleLogin = () => {
    navigate('/exam');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <ProForm
          form={form}
          onFinish={handleLogin}
          submitter={{ 
            render: (_, dom) => dom, 
          }}
        >
          <ProFormText
            name="username"
            label={intl.formatMessage({ id: 'login.username', defaultMessage: '用户名' })}
            placeholder={intl.formatMessage({ id: 'login.username.required', defaultMessage: '请输入用户名' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'login.username.required', defaultMessage: '请输入用户名' }) },
            ]}
            fieldProps={{ size: 'large' }}
            style={{ marginBottom: 16 }}
          />
          <ProFormText.Password
            name="password"
            label={intl.formatMessage({ id: 'login.password', defaultMessage: '密码' })}
            placeholder={intl.formatMessage({ id: 'login.password.required', defaultMessage: '请输入密码' })}
            rules={[
              { required: true, message: intl.formatMessage({ id: 'login.password.required', defaultMessage: '请输入密码' }) },
              { min: 6, message: '密码长度不能少于6位' },
            ]}
            fieldProps={{ size: 'large' }}
            style={{ marginBottom: 24 }}
          />
          <ProFormSubmitButton type="primary" htmlType="submit" block size="large">
            {intl.formatMessage({ id: 'login.submit', defaultMessage: '登录' })}
          </ProFormSubmitButton>
        </ProForm>
      </Card>
    </div>
  );
};

export default Login;