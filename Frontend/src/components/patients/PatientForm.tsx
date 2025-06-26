import React from 'react';
import { Form, Input, InputNumber, Select, Button, Card, Row, Col, message } from 'antd';
import { UserPlus } from 'lucide-react';
import { CreatePatientRequest } from '../../types';
import { apiService } from '../../services/api';

const { Option } = Select;
const { TextArea } = Input;

interface PatientFormProps {
  onSuccess?: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: CreatePatientRequest) => {
    setLoading(true);
    try {
      await apiService.createPatient(values);
      message.success('Patient added successfully!');
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      message.error('Failed to add patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center">
          <UserPlus className="mr-2 text-blue-600" size={24} />
          Add New Patient
        </div>
      }
      className="shadow-sm"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Full Name"
              name="name"
              rules={[
                { required: true, message: 'Please enter patient name' },
                { min: 2, message: 'Name must be at least 2 characters' },
              ]}
            >
              <Input placeholder="Enter full name" size="large" />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={6}>
            <Form.Item
              label="Age"
              name="age"
              rules={[
                { required: true, message: 'Please enter age' },
                { type: 'number', min: 1, max: 120, message: 'Please enter a valid age' },
              ]}
            >
              <InputNumber
                placeholder="Age"
                size="large"
                style={{ width: '100%' }}
                min={1}
                max={120}
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={6}>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: 'Please select gender' }]}
            >
              <Select placeholder="Select gender" size="large">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: 'Please enter phone number' },
                { pattern: /^\+?[\d\s\-\(\)]+$/, message: 'Please enter a valid phone number' },
              ]}
            >
              <Input placeholder="+1-555-0123" size="large" />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please enter email address' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
            >
              <Input placeholder="patient@email.com" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <TextArea
                placeholder="Enter complete address"
                rows={3}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Emergency Contact"
              name="emergencyContact"
              rules={[{ required: true, message: 'Please enter emergency contact details' }]}
            >
              <Input
                placeholder="Name - Phone Number"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="bg-blue-600 hover:bg-blue-700"
            style={{ minWidth: '120px' }}
          >
            Add Patient
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PatientForm;