import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, message, Modal, Button, Form, Input } from 'antd';
import axios from 'axios';

const Calendars = () => {
    const [calendars, setCalendars] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState(null);

    const [form] = Form.useForm();

    
    const columns = useMemo(() => [
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
    ], []);

    
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

    
    const handleSave = useCallback(async (values) => {
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
    }, [isEditMode, selectedCalendar, fetchCalendars]);

    
    const handleDelete = useCallback(async (id) => {
        try {
            await axios.delete(`http://localhost:4000/calendars/${id}`);
            message.success('Calendar deleted successfully');
            fetchCalendars();
        } catch (error) {
            message.error('Failed to delete calendar');
            console.error(error);
        }
    }, [fetchCalendars]);

    
    const openAddModal = useCallback(() => {
        form.resetFields();
        setIsEditMode(false);
        setIsModalVisible(true);
    }, [form]);

    
    const openEditModal = useCallback((calendar) => {
        form.setFieldsValue(calendar);
        setSelectedCalendar(calendar);
        setIsEditMode(true);
        setIsModalVisible(true);
    }, [form]);

    
    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedCalendar(null);
    }, []);

    
    const tableData = useMemo(() => calendars.map(calendar => ({ ...calendar, key: calendar.id })), [calendars]);

    return (
        <>
            <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
                Add Calendar
            </Button>
            <Table 
                columns={columns} 
                dataSource={tableData}
                pagination={{ pageSize: 5 }} 
            />

            
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