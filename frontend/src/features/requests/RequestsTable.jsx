import { App, Button, Card, Form, Modal, Skeleton, Space, Table, Tag } from "antd";
import useRequests from "./useRequests";
import { useState } from "react";
import useUpdateRequest from "./useUpdateRequest";
import RejectForm from "./RejectForm";
import { ROLES } from "../../config/roles";
import PermissionsGate from "../auth/PermissionsGate";

const RequestsTable = () => {
    const { message, notification } = App.useApp();
    const [modal, contextHolder] = Modal.useModal();
    const { isLoadingRequests, requests } = useRequests({
        selector: (requests) => requests?.map(request => ({
            ...request,
            apartmentCode: request.cartItem.apartmentCode
        }))
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    console.log(requests);

    const { isUpdating, updateRequest } = useUpdateRequest();

    const columns = [
        {
            title: 'type',
            dataIndex: 'type',
        },
        {
            title: 'reason',
            dataIndex: 'reason',
        },
        {
            title: 'Apartment Code',
            dataIndex: 'apartmentCode',
            render: (apartmentCode) => <Tag color="green">{apartmentCode}</Tag>
        },
        {
            title: 'status',
            dataIndex: 'status',
            render: (status) => {

                const map = {
                    'pending': 'orange',
                    'approved': 'blue',
                    'rejected': 'red',
                }

                return <Tag color={map[status]}>{status}</Tag>
            }
        },
        {
            title: 'createdAt',
            dataIndex: 'createdAt',
            render: (createdAt) => new Date(createdAt).toLocaleString(),
        },
        {
            title: 'createdBy',
            dataIndex: 'createdBy',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            render: (_, record) => (
                <PermissionsGate roles={[ROLES.ADMIN]}>
                    {
                        record.status === 'pending' &&
                        <>
                            <Button disabled={isUpdating} type="link" onClick={() => {
                                updateRequest(
                                    {
                                        id: record._id,
                                        data: { status: 'approved' }
                                    }
                                )
                            }}>Approve</Button>
                            <Button disabled={isUpdating} type="link" onClick={() => {
                                setFormData({ type: 'update', data: record });
                                setIsModalOpen(true);
                            }}>Reject</Button>
                        </>
                    }
                </PermissionsGate>
            )
        }
    ];

    const isLoading = isLoadingRequests;

    if (isLoading) return <Skeleton />

    return (
        <Space direction="vertical" size={16}>
            <Card>
                <Table columns={columns} dataSource={requests} pagination={false} scroll={{ x: 'max-content' }} />
            </Card>

            <Modal open={isModalOpen}
                onCancel={() => { setIsModalOpen(false) }}
                footer={null}>
                <RejectForm formInstance={formData}
                    onClose={() => { setIsModalOpen(false) }} />
            </Modal>
        </Space>

    )
}

export default RequestsTable;