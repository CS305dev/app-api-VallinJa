import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Row, Col, Card, message } from 'antd';
import { UserOutlined, BookOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../css/HomeOverview.css';

const Home = () => {
    const [studentCount, setStudentCount] = useState(0);
    const [classCount, setClassCount] = useState(0);
    const [enrollmentCount, setEnrollmentCount] = useState(0);

    
    const fetchCounts = useCallback(async () => {
        try {
            const [studentsRes, classesRes, enrollmentsRes] = await Promise.all([
                axios.get('http://localhost:4000/students'),
                axios.get('http://localhost:4000/classes'),
                axios.get('http://localhost:4000/enrollments')
            ]);

            setStudentCount(studentsRes.data.length);
            setClassCount(classesRes.data.length);
            setEnrollmentCount(enrollmentsRes.data.length);
        } catch (error) {
            message.error('Failed to fetch data counts');
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchCounts();
    }, [fetchCounts]);

    
    const overviewCards = useMemo(() => (
        <Row gutter={24} className="dashboard-row">
            <Col span={8}>
                <Card className="dashboard-card students" bordered={false}>
                    <UserOutlined className="icon" />
                    <div>Total Students</div>
                    <div className="count">{studentCount}</div>
                </Card>
            </Col>
            <Col span={8}>
                <Card className="dashboard-card classes" bordered={false}>
                    <BookOutlined className="icon" />
                    <div>Total Classes</div>
                    <div className="count">{classCount}</div>
                </Card>
            </Col>
            <Col span={8}>
                <Card className="dashboard-card enrollments" bordered={false}>
                    <TeamOutlined className="icon" />
                    <div>Total Enrollments</div>
                    <div className="count">{enrollmentCount}</div>
                </Card>
            </Col>
        </Row>
    ), [studentCount, classCount, enrollmentCount]);

    return (
        <div className="home-container">
            <h2>Welcome to the Dashboard</h2>
            {overviewCards}
        </div>
    );
};

export default Home;
