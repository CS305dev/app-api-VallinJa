import { Menu } from 'antd';
import { HomeOutlined, UserOutlined, BookOutlined, CalendarOutlined, DesktopOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const MenuList = ({ darkTheme }) => {
    const location = useLocation(); // Hook to get the current location

    // Define menu items as an array
    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: <Link to="/">Home</Link>,
        },
        {
            key: '/students',
            icon: <UserOutlined />,
            label: <Link to="/students">Students</Link>,
        },
        {
            key: '/classes',
            icon: <BookOutlined />,
            label: <Link to="/classes">Classes</Link>,
        },
        {
            key: '/calendar',
            icon: <CalendarOutlined />,
            label: <Link to="/calendar">Calendar</Link>,
        },
        {
            key: '/enrollment',
            icon: <DesktopOutlined />,
            label: <Link to="/enrollment">Enrollment</Link>,
        },
    ];

    return (
        <Menu
            theme={darkTheme ? 'dark' : 'light'}
            mode="inline"
            className="menu-bar"
            items={menuItems}
            selectedKeys={[location.pathname]} // Highlight the active menu item based on the path
        />
    );
};

export default MenuList;
