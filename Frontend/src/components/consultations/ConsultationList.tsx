import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Space,
  Spin,
  message,
  Select,
  Avatar,
  Tooltip,
  Modal,
  Dropdown,
} from "antd";
import {
  Calendar,
  Clock,
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import dayjs from "dayjs";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";

import { Consultation } from "../../types";
import { apiService } from "../../services/api";

const { Option } = Select;

const ConsultationList: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredConsultations, setFilteredConsultations] = useState<
    Consultation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    const filtered =
      statusFilter === "all"
        ? consultations
        : consultations.filter((c) => c.status === statusFilter);
    setFilteredConsultations(filtered);
  }, [consultations, statusFilter]);

  const loadConsultations = async () => {
    try {
      const data = await apiService.getConsultations();
      setConsultations(data);
      setFilteredConsultations(data);
    } catch (error) {
      message.error("Failed to load consultations");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    consultationId: string,
    newStatus: Consultation["status"]
  ) => {
    try {
      await apiService.updateConsultationStatus(consultationId, newStatus);
      message.success(`Consultation ${newStatus.toLowerCase()} successfully`);
      loadConsultations();
    } catch (error) {
      message.error("Failed to update consultation status");
    }
  };

  const getStatusIcon = (status: Consultation["status"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle size={16} className="text-green-500" />;
      case "Canceled":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-orange-500" />;
    }
  };

  const getStatusColor = (status: Consultation["status"]) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Canceled":
        return "error";
      default:
        return "warning";
    }
  };

  const showDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setDetailModalVisible(true);
  };

  const getActionMenuItems = (record: Consultation): MenuProps["items"] => {
    const items: MenuProps["items"] = [
      {
        key: "view",
        label: "View Details",
        icon: <Eye size={14} />,
        onClick: () => showDetails(record),
      },
    ];

    if (record.status === "Pending") {
      items.push(
        {
          type: "divider",
        },
        {
          key: "complete",
          label: "Mark Complete",
          icon: <CheckCircle size={14} />,
          onClick: () => handleStatusChange(record.id, "Completed"),
        },
        {
          key: "cancel",
          label: "Cancel",
          icon: <XCircle size={14} />,
          danger: true,
          onClick: () => handleStatusChange(record.id, "Canceled"),
        }
      );
    }

    return items;
  };

  const columns: ColumnsType<Consultation> = [
    {
      title: "Patient",
      key: "patient",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar size={32} style={{ backgroundColor: "#1890ff" }}>
            {record.patientName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </Avatar>
          <span className="font-medium">{record.patientName}</span>
        </div>
      ),
      width: 200,
      fixed: "left",
    },
    {
      title: "Date & Time",
      key: "datetime",
      render: (_, record) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Calendar size={14} className="mr-2 text-gray-400" />
            {dayjs(record.date).format("MMM DD, YYYY")}
          </div>
          <div className="flex items-center text-sm">
            <Clock size={14} className="mr-2 text-gray-400" />
            {record.time}
          </div>
        </div>
      ),
      width: 160,
      sorter: (a, b) =>
        dayjs(`${a.date} ${a.time}`).unix() -
        dayjs(`${b.date} ${b.time}`).unix(),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(record.status)}
          <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
        </div>
      ),
      width: 120,
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Completed", value: "Completed" },
        { text: "Canceled", value: "Canceled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      ellipsis: {
        showTitle: false,
      },
      render: (notes) => (
        <Tooltip title={notes}>
          <div className="flex items-center max-w-xs">
            <FileText size={14} className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="text-sm truncate">{notes}</span>
          </div>
        </Tooltip>
      ),
      width: 250,
    },
    {
      title: "Files",
      key: "attachments",
      render: (_, record) => (
        <div className="flex items-center justify-center">
          {record.attachments.length > 0 ? (
            <Tooltip title={`${record.attachments.length} file(s)`}>
              <Button
                type="text"
                size="small"
                icon={<Download size={14} />}
                onClick={() =>
                  message.info(
                    "File download functionality would be implemented here"
                  )
                }
                className="text-blue-600 hover:text-blue-700"
              >
                {record.attachments.length}
              </Button>
            </Tooltip>
          ) : (
            <span className="text-gray-400 text-sm">-</span>
          )}
        </div>
      ),
      width: 80,
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex justify-center">
          <Dropdown
            menu={{ items: getActionMenuItems(record) }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreHorizontal size={16} />}
              className="hover:bg-gray-100"
            />
          </Dropdown>
        </div>
      ),
      width: 80,
      align: "center",
      fixed: "right",
    },
  ];

  return (
    <>
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="mr-2 text-blue-600" size={24} />
              Consultations ({filteredConsultations.length})
            </div>
          </div>
        }
        extra={
          <Space>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
            >
              <Option value="all">All Status</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Canceled">Canceled</Option>
            </Select>
            <Button onClick={loadConsultations} loading={loading}>
              Refresh
            </Button>
          </Space>
        }
        className="shadow-sm"
      >
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredConsultations}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} consultations`,
            }}
            scroll={{ x: 1200 }}
            size="middle"
            className="consultation-table"
          />
        </Spin>
      </Card>

      <Modal
        title="Consultation Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedConsultation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Patient
                </label>
                <p className="mt-1">{selectedConsultation.patientName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Status
                </label>
                <Tag
                  color={getStatusColor(selectedConsultation.status)}
                  className="mt-1"
                >
                  {selectedConsultation.status}
                </Tag>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Date
                </label>
                <p className="mt-1">
                  {dayjs(selectedConsultation.date).format("MMMM DD, YYYY")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Time
                </label>
                <p className="mt-1">{selectedConsultation.time}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">
                Notes
              </label>
              <p className="mt-1 p-3 bg-gray-50 rounded-lg">
                {selectedConsultation.notes}
              </p>
            </div>

            {selectedConsultation.attachments.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Attachments
                </label>
                <div className="mt-1 space-y-2">
                  {selectedConsultation.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <Button
                        type="text"
                        size="small"
                        icon={<Download size={14} />}
                      >
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <style jsx>{`
        .consultation-table .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: 600;
        }

        .consultation-table .ant-table-tbody > tr:hover > td {
          background-color: #f8faff;
        }
      `}</style>
    </>
  );
};

export default ConsultationList;
