import React, { useEffect, useState, useCallback } from 'react';
import { Table, message, Modal, Button, Form, Input, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../css/Tables.css';

const { Search } = Input;

const StudentsTable = () => {
    const [students, setStudents] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [detailedRecord, setDetailedRecord] = useState(null);
    const [file, setFile] = useState(null);

    const [form] = Form.useForm();

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

    const handleSearch = (e) => setSearchText(e.target.value);

    const filteredStudents = students.filter(student =>
        Object.values(student).some(value =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
        { title: 'First Name', dataIndex: 'firstName', key: 'firstName', sorter: (a, b) => a.firstName.localeCompare(b.firstName) },
        { title: 'Middle Name', dataIndex: 'middleName', key: 'middleName', sorter: (a, b) => a.middleName.localeCompare(b.middleName) },
        { title: 'Last Name', dataIndex: 'lastName', key: 'lastName', sorter: (a, b) => a.lastName.localeCompare(b.lastName) },
        { title: 'Date of Birth', dataIndex: 'dateofbirth', key: 'dateofbirth', sorter: (a, b) => new Date(a.dateofbirth) - new Date(b.dateofbirth) },
        { title: 'Address', dataIndex: 'address', key: 'address' },
        { title: 'Enroll', dataIndex: 'enroll', key: 'enroll' },
        { title: 'Email', dataIndex: 'email', key: 'email', sorter: (a, b) => a.email.localeCompare(b.email) },
        { title: 'Contact', dataIndex: 'contact', key: 'contact' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button onClick={() => openEditModal(record)} style={{ marginRight: 8 }}>Edit</Button>
                    <Button onClick={() => handleDelete(record.id)} danger style={{ marginRight: 8 }}>Delete</Button>
                    <Button onClick={() => viewDetails(record)}>View Details</Button>
                </>
            ),
        },
    ];

    const openAddModal = () => {
        form.resetFields();
        setFile(null);
        setIsEditMode(false);
        setIsModalVisible(true);
    };

    const openEditModal = (student) => {
        form.setFieldsValue(student);
        setSelectedStudent(student);
        setIsEditMode(true);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedStudent(null);
        setFile(null);
    };

    const handleFileChange = ({ file }) => setFile(file);

    const handleSave = async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => formData.append(key, values[key]));
        if (file) formData.append('photo', file);

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:4000/students/${selectedStudent.id}`, formData);
                message.success('Student updated successfully');
            } else {
                await axios.post('http://localhost:4000/students', formData);
                message.success('Student added successfully');
            }
            fetchStudents();
            closeModal();
        } catch (error) {
            message.error(`Failed to ${isEditMode ? 'update' : 'add'} student`);
            console.error(error);
        }
    };

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

    const viewDetails = async (record) => {
        try {
            const response = await axios.get(`http://localhost:4000/students/${record.id}`);
            setDetailedRecord(response.data);
            setDetailsModalVisible(true);
        } catch (error) {
            message.error('Failed to load details');
            console.error(error);
        }
    };

    const closeDetailsModal = () => {
        setDetailsModalVisible(false);
        setDetailedRecord(null);
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
                scroll={{ x: 'max-content' }} 
            />

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
                    <Form.Item label="Photo">
                        <Upload beforeUpload={() => false} onChange={handleFileChange}>
                            <Button icon={<UploadOutlined />}>Upload Photo</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={`Student Details - ID: ${detailedRecord?.id}`}
                open={detailsModalVisible}
                onCancel={closeDetailsModal}
                footer={<Button onClick={closeDetailsModal}>Close</Button>}
            >
                {detailedRecord && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <img
                                src={`http://localhost:4000${detailedRecord.photo || '/images/default-profile.jpg'}`}
                                alt="Student"
                                style={{ borderRadius: '50%', width: 150, height: 150 }}
                            />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <p><strong>First Name:</strong> {detailedRecord.firstName}</p>
                            <p><strong>Middle Name:</strong> {detailedRecord.middleName}</p>
                            <p><strong>Last Name:</strong> {detailedRecord.lastName}</p>
                            <p><strong>Date of Birth:</strong> {detailedRecord.dateofbirth || 'N/A'}</p>
                            <p><strong>Address:</strong> {detailedRecord.address || 'N/A'}</p>
                            <p><strong>Enroll:</strong> {detailedRecord.enroll || 'N/A'}</p>
                            <p><strong>Email:</strong> {detailedRecord.email || 'N/A'}</p>
                            <p><strong>Contact:</strong> {detailedRecord.contact || 'N/A'}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default StudentsTable;
