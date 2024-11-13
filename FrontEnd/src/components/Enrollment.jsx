import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Table, message, Modal, Button, Form, Input, Select, Divider } from 'antd';
import axios from 'axios';

const { Option } = Select;

const EnrollmentTable = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [detailedRecord, setDetailedRecord] = useState(null);
    const [classes, setClasses] = useState([]);
    const [form] = Form.useForm();

    
    const columns = useMemo(() => [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
        { title: 'Calendar ID', dataIndex: 'calendarId', key: 'calendarId' },
        {
            title: 'Classes',
            dataIndex: 'studentClasses',
            key: 'studentClasses',
            render: (studentClasses) => studentClasses.map((sc) => sc.classId).join(', '),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button onClick={() => openEditModal(record)} style={{ marginRight: 8 }}>Edit</Button>
                    <Button onClick={() => handleDelete(record.id)} danger style={{ marginRight: 8 }}>Delete</Button>
                    <Button onClick={() => viewDetails(record)}>View Details</Button>
                </>
            ),
        },
    ], []);

    const fetchEnrollments = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:4000/enrollments');
            setEnrollments(response.data);
        } catch (error) {
            message.error('Failed to load enrollments data');
            console.error(error);
        }
    }, []);

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
        fetchEnrollments();
        fetchClasses();
    }, [fetchEnrollments, fetchClasses]);

    const handleSave = useCallback(async (values) => {
        const payload = {
            ...values,
            classIds: values.classIds.map((classId) => Number(classId)),
        };
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:4000/enrollments/${selectedEnrollment.id}`, payload);
                message.success('Enrollment updated successfully');
            } else {
                await axios.post('http://localhost:4000/enrollments', payload);
                message.success('Enrollment added successfully');
            }
            fetchEnrollments();
            closeModal();
        } catch (error) {
            message.error(`Failed to ${isEditMode ? 'update' : 'add'} enrollment`);
            console.error(error);
        }
    }, [isEditMode, selectedEnrollment, fetchEnrollments]);

    const handleDelete = useCallback(async (id) => {
        try {
            await axios.delete(`http://localhost:4000/enrollments/${id}`);
            message.success('Enrollment deleted successfully');
            fetchEnrollments();
        } catch (error) {
            message.error('Failed to delete enrollment');
            console.error(error);
        }
    }, [fetchEnrollments]);

    const openAddModal = useCallback(() => {
        form.resetFields();
        setIsEditMode(false);
        setIsModalVisible(true);
    }, [form]);

    const openEditModal = useCallback((enrollment) => {
        form.setFieldsValue({
            ...enrollment,
            classIds: enrollment.studentClasses.map((sc) => sc.classId),
        });
        setSelectedEnrollment(enrollment);
        setIsEditMode(true);
        setIsModalVisible(true);
    }, [form]);

    const closeModal = useCallback(() => {
        setIsModalVisible(false);
        setSelectedEnrollment(null);
    }, []);

    const viewDetails = useCallback(async (record) => {
        try {
            const response = await axios.get(`http://localhost:4000/enrollments/${record.id}`);
            setDetailedRecord(response.data);
            setDetailsModalVisible(true);
        } catch (error) {
            message.error('Failed to load details');
            console.error(error);
        }
    }, []);

    const closeDetailsModal = useCallback(() => {
        setDetailsModalVisible(false);
        setDetailedRecord(null);
    }, []);

    
    const tableData = useMemo(() => enrollments.map(enrollment => ({ ...enrollment, key: enrollment.id })), [enrollments]);

    return (
        <>
            <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
                Add Enrollment
            </Button>
            <Table 
                columns={columns} 
                dataSource={tableData} 
                pagination={{ pageSize: 5 }} 
            />

            <Modal
                title={isEditMode ? "Edit Enrollment" : "Add Enrollment"}
                open={isModalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="studentId" label="Student ID" rules={[{ required: true, message: 'Please input the student ID!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="calendarId" label="Calendar ID" rules={[{ required: true, message: 'Please input the calendar ID!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="classIds" label="Classes" rules={[{ required: true, message: 'Please select at least one class!' }]}>
                        <Select mode="multiple" placeholder="Select Classes">
                            {classes.map((cls) => (
                                <Option key={cls.id} value={cls.id}>
                                    {cls.classname}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={`Enrollment Details - ID: ${detailedRecord?.id}`}
                open={detailsModalVisible}
                onCancel={closeDetailsModal}
                footer={[
                    <Button key="close" onClick={closeDetailsModal}>
                        Close
                    </Button>,
                ]}
            >
                {detailedRecord && (
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={`http://localhost:4000${detailedRecord.student.photo || '/images/default-profile.jpg'}`}
                            alt="Student"
                            style={{ borderRadius: '50%', width: 150, height: 150, marginBottom: 16 }}
                        />
                        <div style={{ textAlign: 'left', padding: '0 16px' }}>
                            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: 8 }}>Student Details</h3>
                            <p><strong>First Name:</strong> {detailedRecord.student.firstName}</p>
                            <p><strong>Middle Name:</strong> {detailedRecord.student.middleName || 'N/A'}</p>
                            <p><strong>Last Name:</strong> {detailedRecord.student.lastName}</p>
                            <p><strong>Date of Birth:</strong> {detailedRecord.student.dateofbirth || 'N/A'}</p>
                            <p><strong>Address:</strong> {detailedRecord.student.address || 'N/A'}</p>
                            <p><strong>Enroll:</strong> {detailedRecord.student.enroll || 'N/A'}</p>
                            <p><strong>Contact:</strong> {detailedRecord.student.contact || 'N/A'}</p>

                            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginTop: 24, marginBottom: 8 }}>Calendar Details</h3>
                            <p><strong>Semester:</strong> {detailedRecord.calendar.semester}</p>
                            <p><strong>Academic Year:</strong> {detailedRecord.calendar.academicyear}</p>

                            <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginTop: 24, marginBottom: 8 }}>Class Details</h3>
                            {detailedRecord.studentClasses.map((studentClass, index) => (
                                <div key={index} style={{ display: 'flex', borderBottom: '1px solid #ddd', padding: '8px 0' }}>
                                    <p style={{ flex: 1 }}><strong>Class Code:</strong> {studentClass.classes.classCode}</p>
                                    <Divider type="vertical" />
                                    <p style={{ flex: 2 }}><strong>Class Name:</strong> {studentClass.classes.classname}</p>
                                    <Divider type="vertical" />
                                    <p style={{ flex: 3 }}><strong>Description:</strong> {studentClass.classes.description || 'N/A'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default EnrollmentTable;