import { Button, Card, Drawer, Flex, Modal, Skeleton, Space, Table, Tabs, Tag } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { conditionType, filterType } from "../../utils/constants";
import { currencyFormat } from "../../utils/helpers";
import useSoldCartItems from "./useSoldCartItems";
import { selectCurrentUser } from "../../redux/slices/authSlice";

const MyCartTable = () => {
    const userInfo = useSelector(selectCurrentUser);

    console.log('userInfo', userInfo);

    const [searchParams, setSearchParams] = useSearchParams();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [modal, contextHolder] = Modal.useModal();
    const [selectedIds, setSelectedIds] = useState([]);
    const { isLoadingSoldCartItems, soldCartItems } = useSoldCartItems({
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

        }
    ]

    const isLoading = isLoadingSoldCartItems;

    if (isLoading) return <Skeleton />

    return (
        <Space direction="vertical" size={16}>
            <Card>
                <Table dataSource={soldCartItems} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />
            </Card>
        </Space>
    )
}

export default MyCartTable;