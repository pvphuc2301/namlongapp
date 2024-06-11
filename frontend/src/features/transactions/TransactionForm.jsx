import { Alert, App, Button, Checkbox, DatePicker, Form, Input, InputNumber, Select, Skeleton } from "antd";
import useCustomers from "../customers/useCustomers";
import dayjs from "dayjs";
import useProjects from "../projects/useProjects";
import useUpdateTransaction from "./useUpdateTransaction";

const TransactionForm = ({ formData = {} }) => {

    const transactionTypes = [

        {
            label: "Giao dịch CĐT",
            value: "Giao dịch CĐT"
        },
        {
            label: "Giao dịch chuyển nhượng",
            value: "Giao dịch chuyển nhượng"
        }
    ]

    const [form] = Form.useForm();
    const { message } = App.useApp();

    const { isLoadingCustomers, customers } = useCustomers(
        {
            selector: (customers) => customers.map((customer) => ({
                label: `${customer?.firstName} ${customer?.lastName} (${customer?.email})`,
                value: customer?._id,
            }))
        }
    );

    const { isLoadingProjects, projects } = useProjects();

    const main = Form.useWatch('main', form);

    const { isUpdating, updateTransaction } = useUpdateTransaction();

    const isLoading = isLoadingCustomers || isLoadingProjects;

    const isWorking = isUpdating;

    const onFinish = (data) => {

        if (formData.type === 'create') {
            // createTransaction(
            //     data,
            //     {
            //         onSuccess: () => message.success('Create successfully!'),
            //         onError: () => message.error('Create failed!'),
            //     }
            // );
        }

        if (formData.type === 'update') {
            updateTransaction(
                { id: formData.data._id, data },
                {
                    onSuccess: () => message.success('Update successfully!'),
                    onError: () => message.error('Update failed!'),
                }
            );
        }
    }

    if (isLoading) return <Skeleton />

    return (
        <Form
            form={form}
            initialValues={{ ...formData?.data, transactionDate: dayjs(formData?.data?.transactionDate) }}
            onFinish={onFinish}
            layout="vertical">

            <Form.Item name='type' label="Transaction type" rules={[{ required: true, message: 'Please select ${label}' }]}>
                <Select options={transactionTypes} />
            </Form.Item>

            <Form.Item name='seller' label="Seller"
                rules={[{ required: true, message: 'Please select ${label}' }]}>
                <Select
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    options={customers}
                />
            </Form.Item>

            <Alert message="Nếu GD CĐT (online) thông tin Khách BÁN để trống." />

            <Form.Item name='buyer' label="Buyer">
                <Select
                    showSearch
                    allowClear
                    optionFilterProp="label"
                    options={customers}
                />
            </Form.Item>

            <Form.Item name='main' label="Project"
                rules={[{ required: true, message: 'Please select ${label}' }]}
            >
                <Select options={projects?.filter(project => project.type === 'main')?.map((project) => ({ value: project._id, label: project.name }))} />
            </Form.Item>

            <Form.Item name='sub' label="Sub Project"
                rules={[{ required: true, message: 'Please select ${label}' }]}
            >
                <Select options={main && projects?.filter(project => project.parentId === main)?.map((project) => ({ value: project._id, label: project.name }))} />
            </Form.Item>

            <Form.Item name='product' label="Apartment Code" rules={[{ required: true, message: 'Please input ${label}' }]}>
                <Input />
            </Form.Item>

            <Form.Item name='price' label="Price"
                rules={[{ required: true, message: 'Please input ${label}' }]}>
                <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value?.replaceAll('.', ',')?.replace(/\$\s?|(,*)/g, '')} />
            </Form.Item>

            <Form.Item name='transactionDate' label="Transaction Date" rules={[
                { type: 'object' },
                { required: true, message: 'Please select ${label}' }
            ]}>
                <DatePicker />
            </Form.Item>

            <Button type="primary"
                htmlType="submit"
                loading={isWorking}>
                {formData.type.toUpperCase()}
            </Button>
        </Form>
    )
}

export default TransactionForm;