import { App, Button, Card, Skeleton, Space, Table, Tag } from "antd";
import { useState } from "react";
import SearchTable from "../../components/SearchTable";
import TableData from '../../components/TableData';
import { conditionType, filterType } from "../../utils/constants";
import { currencyFormat } from "../../utils/helpers";
import useCartItems from "../mycart/useCartItems";
import useUpdateCartItem from "../mycart/useUpdateCartItem";
import useProjects from "../projects/useProjects";
import PermissionsGate from "../auth/PermissionsGate";
import { ROLES } from "../../config/roles";

const WaitingCartTable = () => {
    const [selectedIds, setSelectedIds] = useState([]);
    const { message } = App.useApp();

    const { isUpdating, updateCartItem } = useUpdateCartItem();

    const { isLoadingProjects, projects } = useProjects();

    const { isLoadingCartItems, cartItems } = useCartItems({
        params: 'status=pending',
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
                type: filterType.selection,
                filterIndex: 'mainName',
                condition: conditionType.eq,
                options: projects?.filter(project => project.type === 'main').map(i => ({ label: i.name, value: i._id })),
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
            key: 'saleName',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            render: (_, record) => {
                return (
                    <PermissionsGate roles={[ROLES.ADMIN]}>
                        <Space size="small">
                            <Button loading={isUpdating} type="link" onClick={() => {
                                updateCartItem(
                                    { id: record._id, data: { status: 'approved' } },
                                    {
                                        onSuccess: () => {
                                            message.success('Update successfully!');
                                        },
                                        onError: () => {
                                            message.error('Update failed!');
                                        }
                                    }
                                );
                            }}>Approve</Button>
                            <Button loading={isUpdating} type="link" onClick={() => {
                                updateCartItem(
                                    { id: record._id, data: { status: 'rejected' } },
                                    {
                                        onSuccess: () => {
                                            message.success('Update successfully!');
                                        },
                                        onError: () => {
                                            message.error('Update failed!');
                                        }
                                    }
                                );
                            }}>Reject</Button>
                        </Space>
                    </PermissionsGate>

                )
            }
        }
    ]

    const isLoading = isLoadingCartItems || isLoadingProjects;

    if (isLoading) return <Skeleton />

    return (
        <Space direction="vertical" size={16}>
            {/* <SearchTable columns={columns.filter(col => !['status', 'state'].includes(col.dataIndex))} /> */}
            <Card>
                <Table columns={columns} dataSource={cartItems} pagination={false} scroll={{ x: 'max-content' }} />
            </Card>
        </Space>
    )
}

export default WaitingCartTable;