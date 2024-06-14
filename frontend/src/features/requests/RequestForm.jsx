import { App, Button, Form, Input, Select } from "antd";
import useCreateRequest from './useCreateRequest';

const RequestForm = ({ formInstance = {}, onclose }) => {
    const { message } = App.useApp();
    const [form] = Form.useForm();

    const type = Form.useWatch('type', form);

    const { isCreating, createRequest } = useCreateRequest();

    const isWorking = isCreating;

    const onFinish = (values) => {
        const data = {
            cartItem: formInstance?.data?._id,
            type: values.type,
            reason: values.reason,
            note: values.note
        }

        if (formInstance.type === 'create') {
            createRequest(
                data,
                {
                    onSuccess: () => {
                        message.success('Create successfully!');
                        onclose?.();
                    },
                    onError: () => message.error('Create failed!'),
                });
        }
    }

    return (
        <Form
            form={form}
            initialValues={formInstance?.data}
            onFinish={onFinish}
            layout="vertical"
        >
            <Form.Item name='apartmentCode' label="Apartment Code">
                <Input readOnly />
            </Form.Item>

            <Form.Item name='type' label="Type">
                <Select options={[{ label: 'stop transaction', value: 'stop transaction' }]} />
            </Form.Item>

            <Form.Item name='reason' label="Reason">
                <Select disabled={!type} options={[{ label: 'Khách ngưng bán', value: 'Khách ngưng bán' }, { label: 'Căn đã bán', value: 'Căn đã bán' }]} />
            </Form.Item>

            <Form.Item name='note' label="Note">
                <Input.TextArea />
            </Form.Item>

            <Button type="primary"
                htmlType="submit"
                loading={isWorking}>
                Save
            </Button>
        </Form>
    )
}

export default RequestForm;