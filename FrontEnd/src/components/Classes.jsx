import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, message, Modal, Button, Form, Input } from 'antd';
import axios from 'axios';

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const [form] = Form.useForm();

    
    const columns = useMemo(() => [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Class Code', dataIndex: 'classCode', key: 'classCode' },
        { title: 'Class Name', dataIndex: 'classname', key: 'classname' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
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

    
    const fetchClasses = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:4000/classes');
            setClasses(response.data);
        } catch (error) {
            message.error('Failed to load classes data');
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    
    const handleSave = useCallback(async (values) => {
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:4000/classes/${selectedClass.id}`, values);
                message.success('Class updated successfully');
            } else {
                await axios.post('http://localhost:4000/classes', values);
                message.success('Class added successfully');
            }
            fetchClasses();
            closeModal();
        } catch (error) {
            message.error(`Failed to ${isEditMode ? 'update' : 'add'} class`);
            console.error(error);
        }
    }, [isEditMode, selectedClass, fetchClasses]);

    
    const handleDelete = useCallback(async (id) => {
        try {
            await axios.delete(`http://localhost:4000/classes/${id}`);
            message.success('Class deleted successfully');
            fetchClasses();
        } catch (error) {
            message.error('Failed to delete class');
            console.error(error);
        }
    }, [fetchClasses]);

    
    const openAddModal = useCallback(() => {
        form.resetFields();
        setIsEditMode(false);
        setIsModalVisible(true);
    }, [form]);

    
    const openEditModal = useCallback((classItem) => {
        form.setFieldsValue(classItem);
        setSelectedClass(classItem);
        setIsEditMode(true);
        setIsModalVisible(true);
    }, [form]);

    
    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedClass(null);
    }, []);

    
    const tableData = useMemo(() => classes.map((classItem) => ({ ...classItem, key: classItem.id })), [classes]);

    return (
        <>
            <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
                Add Class
            </Button>
            <Table 
                columns={columns} 
                dataSource={tableData}
                pagination={{ pageSize: 5 }}
            />

            
            <Modal
                title={isEditMode ? "Edit Class" : "Add Class"}
                open={isModalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item name="classCode" label="Class Code" rules={[{ required: true, message: 'Please input the class code!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="classname" label="Class Name" rules={[{ required: true, message: 'Please input the class name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Classes;
