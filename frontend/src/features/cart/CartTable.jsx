import { Button, Card, Drawer, Flex, Modal, Skeleton, Space, Table, Tag } from "antd";
import { useSearchParams } from "react-router-dom";
import CartForm from "../mycart/CartForm";
import useCartItems from "../mycart/useCartItems";
import { currencyFormat } from "../../utils/helpers";
import { useState } from "react";
import { conditionType, filterType } from "../../utils/constants";
import RequestForm from "../requests/RequestForm";
import PermissionsGate from "../auth/PermissionsGate";
import { ROLES } from "../../config/roles";
import useRequests from "../requests/useRequests";

const CartTable = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [modal, contextHolder] = Modal.useModal();
    const { isLoadingRequests, requests } = useRequests();

    const { isLoadingCartItems, cartItems } = useCartItems({
        // params: `sale=${userInfo?.user._id}`,
        selector: (data) => data?.map(i => ({
            ...i,
            sale: i.sale._id,
            saleName: i.sale.name,
            mainName: i.main.name,
            main: i.main._id,
            subName: i.sub.name,
            sub: i.sub._id,
            blockName: i.block.name,
            block: i.block._id
        })),
    });

    const columns = [
        {
            title: 'Dự Án',
            dataIndex: 'mainName',
            searchKey: 'mainName',
            sorter: 'mainName',
            filter: {
                type: filterType.text,
                filterIndex: 'mainName',
                condition: conditionType.contains,
            }
        },
        {
            title: 'Phân Khu',
            dataIndex: 'subName',
            searchKey: 'subName',
            sorter: 'subName',
            filter: {
                type: filterType.text,
                filterIndex: 'subName',
                condition: conditionType.contains,
            }
        },
        {
            title: 'Block',
            dataIndex: 'blockName',
            searchKey: 'blockName',
            sorter: 'blockName',
            filter: {
                type: filterType.text,
                filterIndex: 'blockName',
                condition: conditionType.contains,
            }
        },
        {
            title: 'Mã Căn',
            dataIndex: 'apartmentCode',
            searchKey: 'apartmentCode',
            sortr: 'apartmentCode',
            filter: {
                type: filterType.text,
                filterIndex: 'apartmentCode',
                condition: conditionType.contains,
            },
            render: (text) => <Tag color="green">{text}</Tag>,
        },
        {
            title: 'Giá bán lại',
            dataIndex: 'price',
            render: (text) => <div style={{ width: 'max-content', minWidth: '110px', textAlign: 'right' }}>{currencyFormat(text)}</div>,
            filter: {
                type: filterType.number,
                filterIndex: 'price',
                condition: conditionType.between
            },
            sorter: 'price',
        },
        {
            title: 'Giá gốc',
            dataIndex: 'originalPrice',
            filter: {
                type: filterType.number,
                filterIndex: 'originalPrice',
                condition: conditionType.between
            },
            sorter: 'originalPrice',
            render: (text) => <div style={{ width: 'max-content', minWidth: '110px', textAlign: 'right' }}>{currencyFormat(text)}</div>,
        },
        {
            title: 'Chênh lệch',
            dataIndex: 'diff',
            filter: {
                type: filterType.number,
                filterIndex: 'diff',
                condition: conditionType.between
            },
            sorter: 'diff',
            render: (text) => <div style={{ width: 'max-content', minWidth: '110px', textAlign: 'right' }}>{currencyFormat(text)}</div>,

        },
        {
            title: 'Diện tích',
            dataIndex: 'area',
            filter: {
                type: filterType.number,
                filterIndex: 'area',
                condition: conditionType.between
            },
            sorter: 'area',
            render: (text) => <div style={{ width: 'max-content', minWidth: '110px', textAlign: 'right' }}>{text} m²</div>,
        },
        {
            title: 'Sale',
            dataIndex: 'saleName',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filter: {
                type: filterType.select,
                filterIndex: 'status',
                condition: conditionType.equal
            },
            render: (text) => {
                const map = {
                    'pending': 'orange',
                    'approved': 'green',
                    'rejected': 'red',
                    'archived': 'default',
                    'deleted': 'red',
                    'processing': 'orange'
                }

                return <Tag color={map[text]}>{text}</Tag>
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            render: (_, record) => {
                let request = [];

                if (record.status === 'approved') {
                    request = requests?.filter(request => request.cartItem._id === record._id).sort((a, b) => a.createdAt - b.createdAt);
                }

                const isPendingRequest = request?.length > 0 && request[0]?.status === 'pending';

                if (record.status === 'archived') return (
                    <Button type="link" onClick={() => { setFormData({ data: record, type: 'update', name: 'cart' }); setOpen(true) }}>Renew</Button>
                )

                return (
                    <PermissionsGate owner={record?.createdBy} roles={[ROLES.ADMIN]}>
                        <Flex>
                            <Button type="link" onClick={() => { setFormData({ data: record, type: 'update', name: 'cart' }); setOpen(true) }}>Edit</Button>
                            {
                                (record.status === 'approved' && !isPendingRequest) &&
                                <Button type='link' onClick={() => { setFormData({ data: record, type: 'create', name: 'request' }); setOpen(true) }}  >
                                    Request
                                </Button>
                            }
                        </Flex>
                    </PermissionsGate>
                )
            }
        }
    ]

    const isLoading = isLoadingCartItems;

    if (isLoading) return <Skeleton />

    const renderForm = () => {
        if (formData.name === 'cart') return <CartForm onClose={() => setOpen(false)} formData={formData} />
        if (formData.name === 'request') return <RequestForm onClose={() => setOpen(false)} formInstance={formData} />
    }

    return (
        <Space direction="vertical" size={16}>
            <Card>

                {/* <Tabs defaultActiveKey="0" items={[
                    {
                        key: '0',
                        label: 'All',
                    }
                ]}
                    onChange={(key) => {
                        switch (key) {
                            case '0':
                                searchParams.delete('status');
                                searchParams.delete('state');

                                break;
                            case '1':
                                searchParams.set('status', 1);
                                searchParams.set('state', 0);

                                break;
                            case '2':
                                // Chờ duyệt
                                // status: 0
                                searchParams.set('status', 0);
                                searchParams.set('state', 0);

                                break;
                            case '3':
                                // Hết hạn
                                // đã duyệt (status 1) và state = 2
                                searchParams.set('status', 1);
                                searchParams.set('state', 2);
                                break;
                            case '4':
                                // Từ chối
                                searchParams.set('status', 2);
                                searchParams.set('state', 0);
                                break;
                        }
                        setSearchParams(searchParams);
                    }} /> */}

                <Table dataSource={cartItems} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />
            </Card>

            <Drawer
                closable
                destroyOnClose
                open={open}
                title={formData.name?.toUpperCase()}
                onClose={() => {
                    setOpen(false)
                }} width={500}>
                {renderForm()}
            </Drawer>

            {contextHolder}
        </Space>
    )
}

export default CartTable;