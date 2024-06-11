import { App, Button, Checkbox, Form, Image, Input, Select, Upload } from "antd";
import { useEffect, useState } from "react";
import useCreateUser from "./useCreateUser";
import useUpdateUser from './useUpdateUser';

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

    const roles = [
        {
            value: 'user',
            label: 'User',
        },
        {
            value: 'sale',
            label: 'Sale',
        },
        {
            value: 'manager',
            label: 'Manager',
        }
    ];

    const [previewOpen, setPreviewOpen] = useState(false);

    const [photo, setPhoto] = useState(() => {
        return formData?.data?.photo ? [{
            uid: 1,
            name: formData?.data?.photo,
            status: 'done',
            url: `/img/users/${formData?.data?.photo}`,
        }] : []
    });

    const [previewImage, setPreviewImage] = useState('');

    const { isCreating, createUser } = useCreateUser();
    const { isUpdating, updateUser } = useUpdateUser();

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
        _formData.append('email', data.email);
        _formData.append('role', data.role);
        _formData.append('active', data.active);

        if (photo.length > 0 && photo[0]?.originFileObj) _formData.append('photo', photo[0]?.originFileObj);

        if (formData.type === 'create') {
            createUser(
                _formData,
                {
                    onSuccess: () => message.success('Create successfully!'),
                    onError: () => message.error('Create failed!'),
                });
        }

        if (formData.type === 'update') {
            updateUser(
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

            <Form.Item name='photo' label="Photo">
                <Upload
                    beforeUpload={async (file) => {
                        setPhoto([file]);
                        return false
                    }}
                    onRemove={(file) => {
                        const index = photo.indexOf(file);
                        const newPhoto = photo.slice();
                        newPhoto.splice(index, 1);
                        setPhoto(newPhoto);
                    }}
                    accept="image/*"
                    listType="picture-card"
                    onPreview={handlePreview}
                    fileList={photo}
                    onChange={({ fileList }) => setPhoto(fileList)}
                >
                    {photo.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>

            <Form.Item name='name' label="Name">
                <Input />
            </Form.Item>

            <Form.Item name='email' label="Email">
                <Input />
            </Form.Item>

            <Form.Item name='role' label="Role">
                <Select disabled={formData.data?.role === 'admin'} options={roles} />
            </Form.Item>

            <Form.Item name='active' valuePropName="checked">
                <Checkbox disabled={formData.data?.role === 'admin'} >Active</Checkbox>
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

            <Button type="primary"
                htmlType="submit"
                loading={isWorking}>
                {formData.type.toUpperCase()}
            </Button>
        </Form>
    )
}

export default ProjectForm;