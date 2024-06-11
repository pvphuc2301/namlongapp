import { Button, Card, Drawer, Flex, Modal, Skeleton, Space, Table, Tag } from "antd";
import { useState } from "react";
import useTransactions from "./useTransactions";
import TransactionForm from "./TransactionForm";
import dayjs from "dayjs";

const TransactionsTable = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [modal, contextHolder] = Modal.useModal();

    const { isLoadingTransactions, transactions } = useTransactions({
        selector: (transactions) => transactions.map((transaction) => ({
            ...transaction,
            seller: transaction?.seller?._id,
            sellerName: transaction?.seller?.firstName + ' ' + transaction?.seller?.lastName,
            buyer: transaction?.buyer?._id,
            buyerName: transaction?.buyer?.firstName + ' ' + transaction?.buyer?.lastName,
            sale: transaction?.sale?._id,
            saleName: transaction?.sale?.name,
        }))
    });

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'seller',
            dataIndex: 'sellerName',
            key: 'sellerName',
        },
        {
            title: 'buyer',
            dataIndex: 'buyerName',
            key: 'buyerName',
        },
        {
            title: 'sale',
            dataIndex: 'saleName',
            key: 'saleName',
        },
        {
            title: 'product',
            dataIndex: 'product',
            key: 'product',
            render: (value) => {
                return (
                    <Tag color="green">{value}</Tag>
                )
            }
        },
        {
            title: 'price',
            dataIndex: 'price',
            key: 'price',
            render: (_, record) => {
                return (
                    <>{record?.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</>
                )
            }
        },
        {
            title: 'Transaction Date',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            render: (_, record) => {
                return (
                    <>{dayjs(record?.transactionDate).format('DD/MM/YYYY')}</>
                )
            }
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

    const isLoading = isLoadingTransactions;

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
                <Table dataSource={transactions} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />
            </Card>

            <Drawer
                closable
                destroyOnClose
                open={open}
                title='Transaction'
                onClose={() => {
                    setOpen(false)
                }} width={500}>
                <TransactionForm formData={formData} />
            </Drawer>
            {contextHolder}
        </Space>
    )
}

export default TransactionsTable;