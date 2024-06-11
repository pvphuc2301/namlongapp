import { Button, Card, Drawer, Flex, Modal, Skeleton, Space, Table } from "antd";
import useCustomers from "./useCustomers";
import { useState } from "react";
import CustomerForm from "./CustomerForm";
import dayjs from "dayjs";

const CustomersTable = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [modal, contextHolder] = Modal.useModal();

    const { isLoadingCustomers, customers } = useCustomers({
        selector: (customers) => customers?.map(customer => ({
            ...customer,
            fullName: `${customer?.firstName} ${customer?.lastName}`
        }))
    });

    // console.log(customers)

    const columns = [
        {
            title: 'photo',
            dataIndex: 'photo',
            key: 'photo',
            render: (text) => <img src={`/img/customers/${text}`} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />,
        },
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName'
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <>
                        <Button type="link" onClick={() => {
                            setFormData({ type: 'update', data: record });
                            setOpen(true)
                        }}>Edit</Button>
                    </>
                )
            }
        }
    ]

    const isLoading = isLoadingCustomers;

    if (isLoading) return <Skeleton />

    return (
        <Space direction="vertical" size="middle">
            <Card>
                <Flex gap={4} justify="end" style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={() => {
                        setFormData({ type: 'create' });
                        setOpen(true)
                    }}>Add New</Button>
                </Flex>
                <Table dataSource={customers} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />
            </Card>

            <Drawer
                closable
                destroyOnClose
                open={open}
                title='Customer'
                onClose={() => {
                    setOpen(false)
                }} width={500}>
                <CustomerForm formData={formData} />
            </Drawer>
            {contextHolder}
        </Space>
    )
}

export default CustomersTable;