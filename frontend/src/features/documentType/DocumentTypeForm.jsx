import { App, Button, Checkbox, Form, Image, Input, Select, Skeleton, Switch, Upload } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import useCreateDocumentType from "./useCreateDocumentType";
import useUpdateDocumentType from './useUpdateDocumentType';
import useProjects from "../projects/useProjects";
import useDocumentTypes from '../documentType/useDocumentTypes';

const DocumentForm = ({ formData = {} }) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const { isCreating, createDocumentType } = useCreateDocumentType();
    const { isUpdating, updateDocumentType } = useUpdateDocumentType();

    const isWorking = isCreating || isUpdating;

    const onFinish = (data) => {

        if (formData.type === 'create') {
            createDocumentType(
                data,
                {
                    onSuccess: () => message.success('Create successfully!'),
                    onError: () => message.error('Create failed!'),
                });
        }

        if (formData.type === 'update') {
            updateDocumentType(
                { id: formData.data._id, data },
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

            <Form.Item name='active' valuePropName="checked">
                <Checkbox>Active</Checkbox>
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