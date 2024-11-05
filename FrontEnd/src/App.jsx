import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button, Layout, theme } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import ToggleThemeButton from './components/ToggleThemeButton';
import Home from './components/Home';
import Students from './components/Students';
import Classes from './components/Classes';
import Calendar from './components/Calendars';
import Enrollment from './components/Enrollment';
import './App.css';

const { Header, Sider, Content } = Layout;

function App() {
    const [darkTheme, setDarkTheme] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    const toggleTheme = () => {
        setDarkTheme(!darkTheme);
    };

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Router>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    collapsed={collapsed}
                    collapsible
                    trigger={null}
                    theme={darkTheme ? 'dark' : 'light'}
                    className="sidebar"
                >
                    <Logo />
                    <MenuList darkTheme={darkTheme} />
                    <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <Button
                            type="text"
                            className="toggle"
                            onClick={() => setCollapsed(!collapsed)}
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        />
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, background: colorBgContainer }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/students" element={<Students />} />
                            <Route path="/classes" element={<Classes />} />
                            <Route path="/calendar" element={<Calendar />} />
                            <Route path="/enrollment" element={<Enrollment />} />
                        </Routes>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
}

export default App;