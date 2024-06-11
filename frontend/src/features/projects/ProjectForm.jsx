import { App, Button, Form, Image, Input, Select, Upload } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import useCreateProject from "./useCreateProject";
import useUpdateProject from './useUpdateProject';
import useProjects from "./useProjects";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ProjectForm = ({ formData = {} }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const types = [
        {
            value: 'main',
            label: 'Main',
        },
        {
            value: 'sub',
            label: 'Sub',
        },
        {
            value: 'block',
            label: 'Block',
        }
    ];

    const { isLoadingProjects, projects } = useProjects();

    const [previewOpen, setPreviewOpen] = useState(false);

    const [fileList, setFileList] = useState(() => {
        return formData?.data?.imageCover ? [{
            uid: 1,
            name: formData?.data?.imageCover,
            status: 'done',
            url: `/img/projects/${formData?.data?.imageCover}`,
        }] : []
    });

    const [images, setImages] = useState(() => {
        return formData?.data?.images?.map((image, index) => ({
            uid: index,
            name: image,
            status: 'done',
            url: `/img/projects/${image}`,
        })) ?? []
    });

    const [previewImage, setPreviewImage] = useState('');

    const { isCreating, createProject } = useCreateProject();
    const { isUpdating, updateProject } = useUpdateProject();

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

    const type = Form.useWatch('type', form);

    const onFinish = (data) => {
        const _formData = new FormData();

        _formData.append('name', data.name);
        _formData.append('type', data.type);
        _formData.append('description', data.description ?? data.description);

        if (data.type === 'sub' || data.type === 'block') _formData.append('parentId', data.parentId);

        if (fileList.length > 0 && fileList[0]?.originFileObj) _formData.append('imageCover', fileList[0]?.originFileObj);

        if (images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                if (images[i]?.originFileObj)
                    _formData.append('images', images[i]?.originFileObj);
                else {
                    _formData.append('images', images[i].name);
                }
            }
        }

        if (formData.type === 'create') {
            createProject(
                _formData,
                {
                    onSuccess: () => message.success('Create successfully!'),
                    onError: () => message.error('Create failed!'),
                });
        }

        if (formData.type === 'update') {
            updateProject(
                { id: formData.data._id, data: _formData },
                {
                    onSuccess: () => message.success('Update successfully!'),
                    onError: () => message.error('Update failed!'),
                });
        }
    }

    return (
        <Form
            form={form}
            initialValues={formData?.data}
            onFinish={onFinish}
            layout="vertical">
            <Form.Item name='name' label="Name">
                <Input />
            </Form.Item>

            <Form.Item name='type' label="Type">
                <Select options={types} />
            </Form.Item>

            {
                ['sub', 'block'].includes(type) &&
                <Form.Item name='parentId' label="Parent">
                    <Select options={projects?.filter((project) => project.type === (type === 'sub' ? 'main' : 'sub'))?.map((project) => ({ value: project._id, label: project.name }))}
                    />
                </Form.Item>
            }

            <Form.Item name='imageCover' label="Image Cover">
                <Upload
                    beforeUpload={async (file) => {
                        setFileList([...fileList, file]);
                        return false
                    }}
                    onRemove={(file) => {
                        const index = fileList.indexOf(file);
                        const newFileList = fileList.slice();
                        newFileList.splice(index, 1);
                        setFileList(newFileList);
                    }}
                    listType="picture"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={({ fileList }) => setFileList(fileList)}
                    accept="image/*">
                    {fileList.length >= 5 ? null : uploadButton}
                </Upload>
            </Form.Item>

            {
                previewImage && (
                    <Image
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )
            }

            <Form.Item name='images' label="Images">
                <Upload
                    beforeUpload={async (file) => {
                        setImages([...images, file]);
                        return false
                    }}
                    onRemove={(file) => {
                        const index = images.indexOf(file);
                        const newImages = images.slice();
                        newImages.splice(index, 1);
                        setImages(newImages);
                    }}
                    accept="image/*"
                    listType="picture-card"
                    onPreview={handlePreview}
                    fileList={images}
                    onChange={({ fileList }) => setImages(fileList)}
                >
                    {images.length >= 8 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item name='description' label="Description">
                <Input.TextArea rows={6} showCount />
            </Form.Item>

            <Button type="primary"
                htmlType="submit"
                loading={isWorking}>
                {formData.type.toUpperCase()}
            </Button>
        </Form>
    )
}

export default ProjectForm;