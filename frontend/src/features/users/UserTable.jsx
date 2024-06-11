import { App, Button, Card, Drawer, Flex, Modal, Skeleton, Space, Table, Tag } from "antd";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useUsers from "./useUsers";
import UserForm from './UserForm';
import PermissionsGate from "../auth/PermissionsGate";
import { ROLES } from "../../config/roles";
import useDeleteUser from "./useDeleteUser";

const UserTable = () => {
    const { message } = App.useApp();
    const [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [modal, contextHolder] = Modal.useModal();

    const { isLoadingUsers, users } = useUsers({
        selector: (users) => users?.map(user => ({
            ...user,
            key: user._id,
            photo: user.photo,
            name: user.name,
            email: user.email,
            role: user.role
        }))
    });

    const { isDeleting, deleteUser } = useDeleteUser();

    const columns = [
        {
            dataIndex: 'photo',
            key: 'photo',
            render: (photo) => (
                <img src={`/img/users/${photo}`}
                    width={50}
                    height={50}
                    style={{ borderRadius: '50%' }} />
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => <Tag color="blue">{role}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'active',
            render: (active) => <Tag color={active ? 'blue' : 'default'}>{active ? 'Active' : 'Inactive'}</Tag>
        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            render: (_, record) => (
                <PermissionsGate roles={[ROLES.ADMIN]}>
                    <Button
                        type="link"
                        onClick={() => {
                            setFormData({ type: 'update', data: { ...record } });
                            setOpen(true)
                        }}>
                        Edit
                    </Button>
                    {
                        record.role !== ROLES.ADMIN &&
                        <Button loading={isDeleting} danger size="small" type="link" onClick={() => {
                            modal.confirm({
                                title: 'Delete Project',
                                content: 'Are you sure you want to delete this project?',
                                onOk: () => {
                                    deleteUser(
                                        record._id,
                                        {
                                            onSuccess: () => message.success('Delete successfully!'),
                                            onError: () => message.error('Delete failed!'),
                                        }
                                    );
                                }
                            });
                        }}>Delete</Button>
                    }
                </PermissionsGate>
            )
        }
    ]

    const isLoading = isLoadingUsers;

    if (isLoading) return <Skeleton />

    return (
        <Space direction="vertical" size={16}>

            <Card>
                <Flex gap={4} justify="end" style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={() => {
                        setFormData({ type: 'create' });
                        setOpen(true)
                    }}>Thêm mới</Button>

                </Flex>

                <Table columns={columns} dataSource={users} pagination={false} scroll={{ x: 'max-content' }} />
            </Card>

            <Drawer
                closable
                destroyOnClose
                open={open}
                onClose={() => {
                    setOpen(false)
                }}
                width={500}>
                <UserForm formData={formData} />
            </Drawer>

            {contextHolder}

        </Space>
    )
}

export default UserTable;