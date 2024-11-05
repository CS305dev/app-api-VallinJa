import React, { useEffect, useState, useCallback } from 'react';
import { Table, message, Modal, Button, Form, Input } from 'antd';
import axios from 'axios';

const { Search } = Input;

const StudentsTable = () => {
    const [students, setStudents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchText, setSearchText] = useState('');

    const [form] = Form.useForm();

    // Fetch students data from the backend
    const fetchStudents = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:4000/students');
            setStudents(response.data);
        } catch (error) {
            message.error('Failed to load students data');
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Filter students by search text
    const filteredStudents = students.filter(student => 
        Object.values(student).some(value =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    // Handle search input change
    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    // Define columns for the table with sorting
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
        },
        {
            title: 'Middle Name',
            dataIndex: 'middleName',
            key: 'middleName',
            sorter: (a, b) => a.middleName.localeCompare(b.middleName),
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: (a, b) => a.lastName.localeCompare(b.lastName),
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dateofbirth',
            key: 'dateofbirth',
            sorter: (a, b) => new Date(a.dateofbirth) - new Date(b.dateofbirth),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Enroll',
            dataIndex: 'enroll',
            key: 'enroll',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
        },
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

    // Handle Create and Update student
    const handleSave = async (values) => {
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:4000/students/${selectedStudent.id}`, values);
                message.success('Student updated successfully');
            } else {
                await axios.post('http://localhost:4000/students', values);
                message.success('Student added successfully');
            }
            fetchStudents();
            closeModal();
        } catch (error) {
            message.error(`Failed to ${isEditMode ? 'update' : 'add'} student`);
            console.error(error);
        }
    };

    // Handle Delete student
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/students/${id}`);
            message.success('Student deleted successfully');
            fetchStudents();
        } catch (error) {
            message.error('Failed to delete student');
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
    const openEditModal = (student) => {
        form.setFieldsValue(student);
        setSelectedStudent(student);
        setIsEditMode(true);
        setIsModalVisible(true);
    };

    // Close Modal
    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedStudent(null);
    };

    return (
        <>
            <Search
                placeholder="Search students"
                onChange={handleSearch}
                style={{ marginBottom: 16 }}
            />
            <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
                Add Student
            </Button>
            <Table 
                columns={columns} 
                dataSource={filteredStudents.map(student => ({ ...student, key: student.id }))} 
                pagination={{ pageSize: 5 }} 
            />

            {/* Modal for Add/Edit Student */}
            <Modal
                title={isEditMode ? "Edit Student" : "Add Student"}
                open={isModalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    {isEditMode && (
                        <Form.Item name="id" label="ID">
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please input the first name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="middleName" label="Middle Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please input the last name!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="dateofbirth" label="Date of Birth" rules={[{ required: true, message: 'Please input the date of birth!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Address">
                        <Input />
                    </Form.Item>
                    <Form.Item name="enroll" label="Enroll">
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="contact" label="Contact">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default StudentsTable;
