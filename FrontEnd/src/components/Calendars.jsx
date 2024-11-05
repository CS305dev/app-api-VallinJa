import React, { useEffect, useState, useCallback } from 'react';
import { Table, message, Modal, Button, Form, Input } from 'antd';
import axios from 'axios';

const Calendars = () => {
    const [calendars, setCalendars] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState(null);

    const [form] = Form.useForm();

    // Define columns for the table
    const columns = [
        { title: 'Semester', dataIndex: 'semester', key: 'semester' },
        { title: 'Academic Year', dataIndex: 'academicyear', key: 'academicyear' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button onClick={() => openEditModal(record)} style={{ marginRight: 8 }}>Edit</Button>
                    <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
                </>
            ),
        },
    ];

    // Fetch calendar data from the backend
    const fetchCalendars = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:4000/calendars');
            setCalendars(response.data);
        } catch (error) {
            message.error('Failed to load calendar data');
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchCalendars();
    }, [fetchCalendars]);

    // Handle Create and Update calendar
    const handleSave = async (values) => {
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:4000/calendars/${selectedCalendar.id}`, values);
                message.success('Calendar updated successfully');
            } else {
                await axios.post('http://localhost:4000/calendars', values);
                message.success('Calendar added successfully');
            }
            fetchCalendars();
            closeModal();
        } catch (error) {
            message.error(`Failed to ${isEditMode ? 'update' : 'add'} calendar`);
            console.error(error);
        }
    };

    // Handle Delete calendar
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/calendars/${id}`);
            message.success('Calendar deleted successfully');
            fetchCalendars();
        } catch (error) {
            message.error('Failed to delete calendar');
            console.error(error);
        }
    };

    // Open Add Modal
    const openAddModal = () => {
        form.resetFields();
        setIsEditMode(false);
        setIsModalVisible(true);
    };

    // Open Edit Modal
    const openEditModal = (calendar) => {
        form.setFieldsValue(calendar);
        setSelectedCalendar(calendar);
        setIsEditMode(true);
        setIsModalVisible(true);
    };

    // Close Modal
    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedCalendar(null);
    };

    return (
        <>
            <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
                Add Calendar
            </Button>
            <Table 
                columns={columns} 
                dataSource={calendars.map(calendar => ({ ...calendar, key: calendar.id }))}
                pagination={{ pageSize: 5 }} 
            />

            {/* Modal for Add/Edit Calendar */}
            <Modal
                title={isEditMode ? "Edit Calendar" : "Add Calendar"}
                open={isModalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item 
                        name="semester" 
                        label="Semester" 
                        rules={[{ required: true, message: 'Please input the semester!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item 
                        name="academicyear" 
                        label="Academic Year" 
                        rules={[{ required: true, message: 'Please input the academic year!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Calendars;
