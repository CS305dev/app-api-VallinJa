import React, { useState, useCallback, useMemo } from 'react';
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

    // Memoize the theme toggle function to avoid recreating it on each render
    const toggleTheme = useCallback(() => {
        setDarkTheme((prevTheme) => !prevTheme);
    }, []);

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // Memoize the layout style object to avoid unnecessary re-renders
    const layoutStyle = useMemo(() => ({ minHeight: '100vh' }), []);
    const contentStyle = useMemo(
        () => ({ margin: '24px 16px', padding: 24, background: colorBgContainer }),
        [colorBgContainer]
    );
    const headerStyle = useMemo(() => ({ padding: 0, background: colorBgContainer }), [colorBgContainer]);

    return (
        <Router>
            <Layout style={layoutStyle}>
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
                    <Header style={headerStyle}>
                        <Button
                            type="text"
                            className="toggle"
                            onClick={() => setCollapsed((prevCollapsed) => !prevCollapsed)}
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        />
                    </Header>
                    <Content style={contentStyle}>
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
