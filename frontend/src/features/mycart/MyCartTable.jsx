import { Button, Card, Drawer, Flex, Modal, Skeleton, Space, Table, Tabs, Tag } from "antd";
import { useState } from "react";
import SearchTable from "../../components/SearchTable";
import useCartItems from "./useCartItems";
import TableData from '../../components/TableData';
import { conditionType, filterType } from "../../utils/constants";
import { currencyFormat } from "../../utils/helpers";
import CartForm from "./CartForm";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import useRequests from "../requests/useRequests";

const MyCartTable = () => {
    const userInfo = useSelector(selectCurrentUser);

    const [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [modal, contextHolder] = Modal.useModal();
    const [selectedIds, setSelectedIds] = useState([]);
    const { isLoadingRequests, requests } = useRequests();

    const { isLoadingCartItems, cartItems } = useCartItems({
        params: `sale=${userInfo?.id}`,
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
                    <>
                        <Flex>
                            <Button type="link" onClick={() => { setFormData({ data: record, type: 'update' }); setOpen(true) }}>Edit</Button>
                            {
                                (record.status === 'approved' && !isPendingRequest) &&
                                <Button type='link' onClick={() => { setFormData({ data: record, type: 'create', name: 'request' }); setOpen(true) }}  >
                                    Request
                                </Button>
                            }
                        </Flex>
                    </>
                )
            }
        }
    ]

    const isLoading = isLoadingCartItems || isLoadingRequests;

    if (isLoading) return <Skeleton />

    return (
        <Space direction="vertical" size={16}>
            {/* <SearchTable columns={columns.filter(col => !['status', 'state'].includes(col.dataIndex))} /> */}
            <Card>
                <Flex gap={4} justify="end" style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={() => {
                        setFormData({ type: 'create' });
                        setOpen(true)
                    }}>Add New</Button>
                </Flex>

                <Table dataSource={cartItems} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />
            </Card>

            <Drawer
                closable
                destroyOnClose
                open={open}
                onClose={() => {
                    setOpen(false)
                }} width={500}>
                <CartForm onClose={() => setOpen(false)} formData={formData} />
            </Drawer>

            {contextHolder}
        </Space>
    )
}

export default MyCartTable;