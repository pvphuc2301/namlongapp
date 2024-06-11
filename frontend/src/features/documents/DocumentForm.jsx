import { App, Button, Checkbox, Form, Input, Select, Skeleton, Upload } from "antd";
import { useState } from "react";
import useDocumentTypes from '../documentType/useDocumentTypes';
import useProjects from "../projects/useProjects";
import useCreateDocument from "./useCreateDocument";
import useUpdateDocument from './useUpdateDocument';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const DocumentForm = ({ formData = {} }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const { isLoadingProjects, projects } = useProjects({
        selector: (data) => data?.filter(i => i.type === 'main')
    });

    const { isLoadingDocumentTypes, documentTypes } = useDocumentTypes();

    const [previewOpen, setPreviewOpen] = useState(false);

    const [attachments, setAttachments] = useState(() => {
        return formData?.data?.attachments?.map((attachment, index) => ({
            uid: index,
            name: attachment,
            status: 'done',
            url: `/upload/${attachment}`,
        })) ?? []
    });

    const [previewImage, setPreviewImage] = useState('');

    const { isCreating, createDocument } = useCreateDocument();
    const { isUpdating, updateDocument } = useUpdateDocument();

    const isWorking = isCreating || isUpdating;

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originalFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    }

    const uploadButton = (
        <button style={{
            border: 0,
            background: 'none',
        }} type="button">
            <div
                style={{
                    marginTop: 8,
                }}
            >
                <i className="bi bi-upload"></i> Upload
            </div>
        </button>
    )


    const onFinish = (data) => {
        const _formData = new FormData();

        _formData.append('name', data.name);
        _formData.append('project', data.project);
        _formData.append('type', data.type);
        _formData.append('description', data.description ?? '');

        if (attachments.length > 0) {
            for (let i = 0; i < attachments.length; i++) {
                if (attachments[i]?.originFileObj) {
                    _formData.append('attachments', attachments[i]?.originFileObj);
                }
                else {
                    _formData.append('attachments', attachments[i].name);
                }
            }
        }

        if (formData.type === 'create') {
            createDocument(
                _formData,
                {
                    onSuccess: () => message.success('Create successfully!'),
                    onError: () => message.error('Create failed!'),
                });
        }

        if (formData.type === 'update') {
            updateDocument(
                { id: formData.data._id, data: _formData },
                {
                    onSuccess: () => message.success('Update successfully!'),
                    onError: () => message.error('Update failed!'),
                });
        }
    }

    const isLoading = isLoadingProjects || isLoadingDocumentTypes;

    if (isLoading) return <Skeleton />

    return (
        <Form
            form={form}
            initialValues={formData?.data}
            onFinish={onFinish}
            layout="vertical">
            <Form.Item name='name' label="Name" rules={[{ required: true, message: 'Please input name!' }]}>
                <Input />
            </Form.Item>

            <Form.Item name='type' label="Type" rules={[{ required: true, message: 'Please select type!' }]}>
                <Select options={documentTypes?.map((type) => ({ value: type._id, label: type.name }))} />
            </Form.Item>

            <Form.Item name='project' label="Project" rules={[{ required: true, message: 'Please select project!' }]}>
                <Select options={projects?.map((project) => ({ value: project._id, label: project.name }))} />
            </Form.Item>

            <Form.Item name='description' label="Description">
                <Input.TextArea rows={6} showCount />
            </Form.Item>

            <Form.Item name='attachments' label="Attachments">
                <Upload
                    beforeUpload={async (file) => {
                        setAttachments([...attachments, file]);
                        return false
                    }}
                    onRemove={(file) => {
                        const index = attachments.indexOf(file);
                        const newAttachments = attachments.slice();
                        newAttachments.splice(index, 1);
                        setAttachments(newAttachments);
                    }}
                    listType="text"
                    onPreview={handlePreview}
                    fileList={attachments}
                    onChange={({ fileList }) => setAttachments(fileList)}
                >
                    {attachments.length >= 8 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Button type="primary"
                htmlType="submit"
                loading={isWorking}>
                {formData.type.toUpperCase()}
            </Button>
        </Form>
    )
}

export default DocumentForm;