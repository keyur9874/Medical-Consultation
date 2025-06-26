import React, { useState } from 'react';
import { Layout, Menu, Typography, Button, theme } from 'antd';
import {
  UserPlus,
  Users,
  Calendar,
  CalendarCheck,
  Stethoscope,
  Menu as MenuIcon,
} from 'lucide-react';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
  selectedKey: string;
  onMenuSelect: (key: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, selectedKey, onMenuSelect }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'patients',
      icon: <Users size={18} />,
      label: 'Patients',
    },
    {
      key: 'add-patient',
      icon: <UserPlus size={18} />,
      label: 'Add Patient',
    },
    {
      key: 'consultations',
      icon: <Calendar size={18} />,
      label: 'Consultations',
    },
    {
      key: 'schedule-consultation',
      icon: <CalendarCheck size={18} />,
      label: 'Schedule Consultation',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        style={{
          background: '#1e3a8a',
        }}
      >
        <div className="flex items-center justify-center p-4 border-b border-blue-600">
          <Stethoscope className="text-white mr-2" size={24} />
          {!collapsed && (
            <Title level={4} className="text-white m-0">
              MedConsult
            </Title>
          )}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ background: '#1e3a8a', border: 'none' }}
          items={menuItems}
          onClick={({ key }) => onMenuSelect(key)}
        />
      </Sider>
      
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={<MenuIcon size={18} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 40,
              height: 40,
            }}
          />
          
          <Title level={3} style={{ margin: '0 0 0 16px', color: '#1e3a8a' }}>
            Medical Consultation Management
          </Title>
        </Header>
        
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;