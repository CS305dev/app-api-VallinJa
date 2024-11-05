import React, { useEffect, useState, useCallback } from 'react';
import { Table, message, Modal, Button, Form, Input } from 'antd';
import axios from 'axios';

const EnrollmentTable = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [detailedRecord, setDetailedRecord] = useState(null);

    const [form] = Form.useForm();

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
        { title: 'Calendar ID', dataIndex: 'calendarId', key: 'calendarId' },
        { title: 'Class ID', dataIndex: 'classId', key: 'classId' },
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
    ];

    const fetchEnrollments = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:4000/enrollments');
            setEnrollments(response.data);
        } catch (error) {
            message.error('Failed to load enrollments data');
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchEnrollments();
    }, [fetchEnrollments]);

    const handleSave = async (values) => {
        try {
            if (isEditMode) {
                await axios.put(`http://localhost:4000/enrollments/${selectedEnrollment.id}`, values);
                message.success('Enrollment updated successfully');
            } else {
                await axios.post('http://localhost:4000/enrollments', values);
                message.success('Enrollment added successfully');
            }
            fetchEnrollments();
            closeModal();
        } catch (error) {
            message.error(`Failed to ${isEditMode ? 'update' : 'add'} enrollment`);
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/enrollments/${id}`);
            message.success('Enrollment deleted successfully');
            fetchEnrollments();
        } catch (error) {
            message.error('Failed to delete enrollment');
            console.error(error);
        }
    };

    const openAddModal = () => {
        form.resetFields();
        setIsEditMode(false);
        setIsModalVisible(true);
    };

    const openEditModal = (enrollment) => {
        form.setFieldsValue(enrollment);
        setSelectedEnrollment(enrollment);
        setIsEditMode(true);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setSelectedEnrollment(null);
    };

    const viewDetails = async (record) => {
        try {
            const response = await axios.get(`http://localhost:4000/enrollments/${record.id}`);
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
            <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
                Add Enrollment
            </Button>
            <Table 
                columns={columns} 
                dataSource={enrollments.map(enrollment => ({ ...enrollment, key: enrollment.id }))} 
                pagination={{ pageSize: 5 }} 
            />

            <Modal
                title={isEditMode ? "Edit Enrollment" : "Add Enrollment"}
                open={isModalVisible}
                onCancel={closeModal}
                onOk={() => form.submit()}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSave}
                >
                    <Form.Item name="studentId" label="Student ID" rules={[{ required: true, message: 'Please input the student ID!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="calendarId" label="Calendar ID" rules={[{ required: true, message: 'Please input the calendar ID!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="classId" label="Class ID" rules={[{ required: true, message: 'Please input the class ID!' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal for Viewing Details */}
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
                    <div>
                        {/* Image section */}
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <img
                                src="https://scontent.fmnl13-1.fna.fbcdn.net/v/t39.30808-6/465136101_8276335372488419_4473639598239824614_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHbiAZ4hQuS42GYUmzH9Phifw3clFT7E0N_DdyUVPsTQ-tALUX4dK5a7NPF5aS89xAt5owkZME6wDtbWNGans4S&_nc_ohc=TBoU9gP2u9QQ7kNvgFJvadX&_nc_zt=23&_nc_ht=scontent.fmnl13-1.fna&_nc_gid=AOkwVSy1I7Qe4KGnHNO6dqG&oh=00_AYC6Mh1oWBKVgzNKMIWjFWWM-55jYJScruQV8NUj8dhe2w&oe=672FB418" // Replace with actual image URL if available
                                alt="Student"
                                style={{ borderRadius: '50%', width: 150, height: 150 }}
                            />
                        </div>

                        {/* Student details */}
                        <div>
                            <h3>Student Details</h3>
                            <p><strong>First Name:</strong> {detailedRecord.student.firstName}</p>
                            <p><strong>Middle Name:</strong> {detailedRecord.student.middleName}</p>
                            <p><strong>Last Name:</strong> {detailedRecord.student.lastName}</p>
                            <p><strong>Date of Birth:</strong> {detailedRecord.student.dateofbirth || 'N/A'}</p>
                            <p><strong>Address:</strong> {detailedRecord.student.address || 'N/A'}</p>
                            <p><strong>Enroll:</strong> {detailedRecord.student.enroll || 'N/A'}</p>
                            <p><strong>Contact:</strong> {detailedRecord.student.contact || 'N/A'}</p>
                        </div>

                        {/* Calendar details */}
                        <div style={{ marginTop: 16 }}>
                            <h3>Calendar Details</h3>
                            <p><strong>Semester:</strong> {detailedRecord.calendar.semester}</p>
                            <p><strong>Academic Year:</strong> {detailedRecord.calendar.academicyear}</p>
                        </div>

                        {/* Class details */}
                        <div style={{ marginTop: 16 }}>
                            <h3>Class Details</h3>
                            <p><strong>Class Code:</strong> {detailedRecord.class.classCode}</p>
                            <p><strong>Class Name:</strong> {detailedRecord.class.classname}</p>
                            <p><strong>Description:</strong> {detailedRecord.class.description}</p>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default EnrollmentTable;
