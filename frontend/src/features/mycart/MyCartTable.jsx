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
const MyCartTable = () => {
    const userInfo = useSelector(selectCurrentUser);

    const [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [modal, contextHolder] = Modal.useModal();
    const [selectedIds, setSelectedIds] = useState([]);

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
                // 0: pending 
                // 1: approved 
                // 2: rejected
                // 3: archived

                const color = text === 'pending' ? 'orange' : text === 'approved' ? 'green' : 'red'

                return <Tag color={color}>{text}</Tag>
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <Flex>
                        <Button type="link" onClick={() => { setFormData({ data: record, type: 'update' }); setOpen(true) }}>Edit</Button>
                    </Flex>
                )
            }
        }
    ]

    const isLoading = isLoadingCartItems;

    if (isLoading) return <Skeleton />

    return (
        <Space direction="vertical" size={16}>
            {/* <SearchTable columns={columns.filter(col => !['status', 'state'].includes(col.dataIndex))} /> */}
            <Card>
                <Flex gap={4} justify="end">
                    {/* <PermissionsGate scopes={[SCOPES.ARTICLE_CREATE]}>
                                <Modal.Open opens={SCOPES.ARTICLE_CREATE}>
                                </Modal.Open>
                            </PermissionsGate> */}
                    <Button type="primary" onClick={() => {
                        setFormData({ type: 'create' });
                        setOpen(true)
                    }}>Add New</Button>
                </Flex>

                <Tabs defaultActiveKey="0" items={[
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
                    }} />

                <Table dataSource={cartItems} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />

                {/* <TableData
                    rowSelection={{
                        selectedRowKeys: selectedIds,
                        onChange: (selectedRowKeys) => setSelectedIds(selectedRowKeys),
                    }}
                    columns={columns.filter(column => !['status'].includes(column.dataIndex))}
                    data={cartItems} /> */}
            </Card>

            <Drawer
                closable
                destroyOnClose
                open={open}
                onClose={() => {
                    setOpen(false)
                }} width={500}>
                <CartForm formData={formData} />
            </Drawer>

            {contextHolder}
        </Space>
    )
}

export default MyCartTable;