import { App, Button, Card, Drawer, Flex, Modal, Skeleton, Space, Table } from "antd";
import { useState } from "react";
import useDocumentTypes from "./useDocumentTypes";
import DocumentTypeForm from "./DocumentTypeForm";
import { ROLES } from "../../config/roles";
import PermissionsGate from "../auth/PermissionsGate";
import useDeleteDocumentType from "./useDeleteDocumentType";

const DocumentTypeTable = () => {
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [modal, contextHolder] = Modal.useModal();

    const { isLoadingDocumentTypes, documentTypes } = useDocumentTypes();
    const { isDeleting, deleteDocumentType } = useDeleteDocumentType();

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            searchKey: 'name',
            sorter: 'name',
            filter: {
                type: 'text',
                filterIndex: 'name',
                condition: 'contains',
            }
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            searchKey: 'createdAt',
            sorter: 'createdAt',
            filter: {
                type: 'date',
                filterIndex: 'createdAt',
                condition: 'contains',
            },
            render: (text) => {
                return new Date(text).toLocaleString();
            }
        },
        {
            title: 'Updated Date',
            dataIndex: 'updatedAt',
            searchKey: 'updatedAt',
            sorter: 'updatedAt',
            filter: {
                type: 'date',
                filterIndex: 'updatedAt',
                condition: 'contains',
            },
            render: (text) => {
                return text && new Date(text).toLocaleString();
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            render: (_, record) => {

                return (
                    <PermissionsGate roles={[ROLES.ADMIN]}>
                        <Button type="link" onClick={() => {
                            setFormData({ type: 'update', data: record });
                            setOpen(true)
                        }}>Edit</Button>
                        <Button loading={isDeleting} type="link" danger onClick={() => {
                            modal.confirm({
                                title: 'Delete Document Type',
                                content: 'Are you sure you want to delete this document type?',
                                onOk: () => {
                                    deleteDocumentType(
                                        record._id,
                                        {
                                            onSuccess: () => message.success('Delete successfully!'),
                                            onError: () => message.error('Delete failed!'),
                                        }
                                    );
                                }
                            });
                        }}>Delete</Button>
                    </PermissionsGate>
                )
            }
        }
    ];

    if (isLoadingDocumentTypes) return <Skeleton />

    return (
        <Space direction="vertical" size={16}>
            <Card>
                <PermissionsGate roles={[ROLES.ADMIN]}>
                    <Flex gap={4} justify="end" style={{ marginBottom: 16 }}>
                        <Button type="primary" onClick={() => {
                            setFormData({ type: 'create' });
                            setOpen(true)
                        }}>Add New</Button>
                    </Flex>
                </PermissionsGate>

                <Table dataSource={documentTypes} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />
            </Card>

            <Drawer
                closable
                destroyOnClose
                open={open}
                title='Document Type'
                onClose={() => {
                    setOpen(false)
                }} width={500}>
                <DocumentTypeForm formData={formData} />
            </Drawer>

            {contextHolder}
        </Space>

    )
}

export default DocumentTypeTable;