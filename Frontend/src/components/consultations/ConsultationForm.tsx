import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  DatePicker,
  TimePicker,
  Input,
  Button,
  Card,
  Row,
  Col,
  Upload,
  message,
  Divider,
} from "antd";
import { CalendarCheck, Upload as UploadIcon, Paperclip } from "lucide-react";
import dayjs from "dayjs";

import { Patient, CreateConsultationRequest } from "../../types";
import { apiService } from "../../services/api";

const { Option } = Select;
const { TextArea } = Input;

interface ConsultationFormProps {
  selectedPatient?: Patient | null;
  onSuccess?: () => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({
  selectedPatient,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      form.setFieldValue("patientId", selectedPatient.id);
    }
  }, [selectedPatient, form]);

  const loadPatients = async () => {
    try {
      const data = await apiService.getPatients();
      setPatients(data);
    } catch (error) {
      message.error("Failed to load patients");
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const consultationData: CreateConsultationRequest = {
        patientId: values.patientId,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("HH:mm"),
        notes: values.notes || "",
        attachments: fileList.map((file) => file.originFileObj).filter(Boolean),
      };

      await apiService.createConsultation(consultationData);
      message.success("Consultation scheduled successfully!");
      form.resetFields();
      setFileList([]);
      onSuccess?.();
    } catch (error) {
      message.error("Failed to schedule consultation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  const uploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }: any) => setFileList(newFileList),
    beforeUpload: () => false, // Prevent auto upload
    multiple: true,
  };

  return (
    <Card
      title={
        <div className="flex items-center">
          <CalendarCheck className="mr-2 text-blue-600" size={24} />
          Schedule Consultation
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
          <Col xs={24}>
            <Form.Item
              label="Select Patient"
              name="patientId"
              rules={[{ required: true, message: "Please select a patient" }]}
            >
              <Select
                placeholder="Choose patient"
                size="large"
                showSearch
                optionFilterProp="children"
                disabled={!!selectedPatient}
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
              >
                {patients.map((patient) => (
                  <Option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.age} years ({patient.gender})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Consultation Date"
              name="date"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker
                size="large"
                style={{ width: "100%" }}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Consultation Time"
              name="time"
              rules={[{ required: true, message: "Please select time" }]}
            >
              <TimePicker
                size="large"
                style={{ width: "100%" }}
                format="HH:mm"
                minuteStep={15}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Consultation Notes"
              name="notes"
              rules={[
                { required: true, message: "Please enter consultation notes" },
              ]}
            >
              <TextArea
                placeholder="Enter reason for consultation, symptoms, or any relevant notes..."
                rows={4}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item label="Attachments (Optional)">
              <Upload.Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <UploadIcon size={48} className="text-blue-400" />
                </p>
                <p className="ant-upload-text">
                  Click or drag files to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for medical reports, images, or any relevant
                  documents. You can upload multiple files.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>

        {fileList.length > 0 && (
          <Row gutter={16}>
            <Col xs={24}>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <Paperclip size={16} className="mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Attached Files ({fileList.length})
                  </span>
                </div>
                <div className="space-y-1">
                  {fileList.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      • {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        )}

        <Form.Item className="mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="bg-blue-600 hover:bg-blue-700"
            style={{ minWidth: "150px" }}
          >
            Schedule Consultation
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ConsultationForm;
