import { ProLayout, MenuDataItem } from '@ant-design/pro-components';
import { useIntl } from 'react-intl';
import { HomeOutlined, BookOutlined, CalendarOutlined, SettingOutlined, GlobalOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { useLocale } from '../contexts/LocaleContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  const intl = useIntl();
  const { children } = props;
  const { locale, toggleLocale } = useLocale();

  const menuData: MenuDataItem[] = [
    {
      path: '/exam',
      name: intl.formatMessage({ id: 'menu.exam.list', defaultMessage: '考试列表' }),
      icon: <BookOutlined />,
    },
  ];

  // 语言切换菜单
  const localeMenu = (
    <Menu onClick={(e) => toggleLocale(e.key)}>
      <Menu.Item key="zh-CN">中文</Menu.Item>
      <Menu.Item key="en-US">English</Menu.Item>
    </Menu>
  );

  return (
    <ProLayout
      title={intl.formatMessage({ id: 'app.title', defaultMessage: '考试管理系统' })}
      menuDataRender={() => menuData}
      location={{ pathname: window.location.pathname }}
      onMenuHeaderClick={() => {
        window.location.href = '/';
      }}
      rightContentRender={() => (
        <Dropdown overlay={localeMenu} trigger={['click']}>
          <Button type="text" icon={<GlobalOutlined />}>
            {locale === 'zh-CN' ? '中文' : 'English'}
          </Button>
        </Dropdown>
      )}
    >
      {children}
    </ProLayout>
  );
};

export default Layout;