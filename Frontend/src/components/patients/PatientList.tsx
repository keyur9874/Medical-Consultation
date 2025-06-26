import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Button, Tag, Space, Spin, message, Avatar } from 'antd';
import { Users, Search, Phone, Mail, MapPin } from 'lucide-react';
import { Patient } from '../../types';
import { apiService } from '../../services/api';
import type { ColumnsType } from 'antd/es/table';

const { Search: SearchInput } = Input;

interface PatientListProps {
  onPatientSelect?: (patient: Patient) => void;
  selectable?: boolean;
}

const PatientList: React.FC<PatientListProps> = ({ onPatientSelect, selectable = false }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.phone.includes(searchText)
    );
    setFilteredPatients(filtered);
  }, [patients, searchText]);

  const loadPatients = async () => {
    try {
      const data = await apiService.getPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      message.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const columns: ColumnsType<Patient> = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            size={40}
            style={{
              backgroundColor: record.gender === 'Male' ? '#1890ff' : record.gender === 'Female' ? '#f759ab' : '#52c41a',
            }}
          >
            {getInitials(record.name)}
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{record.name}</div>
            <div className="text-sm text-gray-500">
              {record.age} years • {record.gender}
            </div>
          </div>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Phone size={14} className="mr-2 text-gray-400" />
            {record.phone}
          </div>
          <div className="flex items-center text-sm">
            <Mail size={14} className="mr-2 text-gray-400" />
            {record.email}
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      render: (address) => (
        <div className="flex items-start">
          <MapPin size={14} className="mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{address}</span>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: 'Emergency Contact',
      dataIndex: 'emergencyContact',
      key: 'emergencyContact',
      render: (contact) => (
        <span className="text-sm">{contact}</span>
      ),
      ellipsis: true,
    },
    {
      title: 'Status',
      key: 'status',
      render: () => (
        <Tag color="green">Active</Tag>
      ),
      width: 100,
    },
  ];

  if (selectable) {
    columns.push({
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => onPatientSelect?.(record)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Select
        </Button>
      ),
      width: 100,
    });
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="mr-2 text-blue-600" size={24} />
            Patients ({filteredPatients.length})
          </div>
        </div>
      }
      extra={
        <Space>
          <SearchInput
            placeholder="Search patients..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            prefix={<Search size={16} />}
          />
          <Button onClick={loadPatients} loading={loading}>
            Refresh
          </Button>
        </Space>
      }
      className="shadow-sm"
    >
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} patients`,
          }}
          scroll={{ x: 800 }}
        />
      </Spin>
    </Card>
  );
};

export default PatientList;