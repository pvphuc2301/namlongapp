import { App, Button, Form, Input, InputNumber, Select, Skeleton, message } from "antd";
import useProjects from "../projects/useProjects";
import useCreateCartItem from "./useCreateCartItem";
import useUpdateCartItem from "./useUpdateCartItem";
import useUsers from "../users/useUsers";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const CartForm = ({ formData = {} }) => {
    const { message } = App.useApp();

    const [form] = Form.useForm();

    const { isLoadingUsers, users } = useUsers({
        selector: (users) => users.filter(user => user.role === 'user')
    });

    console.log(formData);

    const { isLoadingProjects, projects } = useProjects();
    const { isCreating, createCartItem } = useCreateCartItem();
    const { isUpdating, updateCartItem } = useUpdateCartItem();

    const isLoading = isLoadingProjects || isLoadingUsers;
    const isWorking = isCreating || isUpdating;

    const main = Form.useWatch('main', form);
    const sub = Form.useWatch('sub', form);

    if (isLoading) return <Skeleton />

    const onFinish = (values) => {

        if (formData.type === 'create') {
            createCartItem(
                values,
                {
                    onSuccess: () => {
                        message.success('Create successfully!');
                        // form.resetFields();
                    },
                    onError: () => {
                        message.error('Create failed!');
                    }
                });
        }

        if (formData.type === 'update') {
            updateCartItem(
                { id: formData.data._id, data: values },
                {
                    onSuccess: () => {
                        message.success('Update successfully!');
                        // form.resetFields();
                    },
                    onError: () => {
                        message.error('Update failed!');
                    }
                });
        }
    }

    return (
        <Form
            form={form}
            initialValues={formData?.data}
            onFinish={onFinish}
            layout="vertical"
        >
            <Form.Item name='main' label="Dự án"
                rules={[{ required: true, message: 'Please select project' }]}
            >
                <Select options={projects?.filter(project => project.type === 'main')?.map((project) => ({ value: project._id, label: project.name }))} />
            </Form.Item>

            <Form.Item name='sub' label="Phân Khu"
                rules={[{ required: true, message: 'Please select sub project' }]}
            >
                <Select options={main && projects?.filter(project => project.parentId === main)?.map((project) => ({ value: project._id, label: project.name }))} />
            </Form.Item>

            <Form.Item name='block' label="Block"
                rules={[{ required: true, message: 'Please select block' }]}
            >
                <Select options={sub && projects?.filter(project => project.parentId === sub)?.map((project) => ({ value: project._id, label: project.name }))} />
            </Form.Item>

            {/* <Form.Item
                name="apartmentCode"
                label="Mã Căn"
                rules={[{ required: true, message: 'Please input your name!' }]}
            >
                <Input />
            </Form.Item> */}

            <Form.Item
                name='floor'
                label="Tầng"
                rules={[{ required: true, message: 'Please input floor!' }]}
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name='position'
                label="Vị trí"
                rules={[{ required: true, message: 'Please input position!' }]}
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name='area'
                label='Diện tích'
                rules={[{ required: true, message: 'Please input area!' }]}
            >
                <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name='price'
                label="Giá Bán"
                rules={[{ required: true, message: 'Please input price!' }]}
            >
                <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name='originalPrice'
                label="Giá"
                rules={[{ required: true, message: 'Please input price!' }]}
            >
                <InputNumber
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                    style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name='sale'
                label="Sale"
                rules={[{ required: true, message: 'Please select sale' }]}
            >
                <Select options={users?.map((user) => ({ value: user._id, label: `${user.name} - ${user.email}` }))} />
            </Form.Item>

            <Button type="primary"
                htmlType="submit"
                loading={isWorking}>
                {formData.type.toUpperCase()}
            </Button>

        </Form>
    )
}

export default CartForm;