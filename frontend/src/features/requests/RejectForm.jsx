import { App, Button, Form, Input, Select } from "antd";
import useUpdateRequest from "./useUpdateRequest";

const RejectForm = ({ formInstance = {}, onClose }) => {
    const { message } = App.useApp();
    const [form] = Form.useForm();

    const { isUpdating, updateRequest } = useUpdateRequest();

    const isWorking = isUpdating;

    const onFinish = (values) => {
        updateRequest(
            {
                id: formInstance.data._id,
                data: {
                    status: 'rejected',
                    rejectReason: values.rejectReason
                }
            },
            {
                onSuccess: () => {
                    message.success('Request rejected successfully')
                    onClose?.();
                }
            }
        )
    }

    return (
        <Form
            form={form}
            initialValues={formInstance?.data}
            onFinish={onFinish}
            layout="vertical"
        >
            <Form.Item name='rejectReason' label="Reason">
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

export default RejectForm;