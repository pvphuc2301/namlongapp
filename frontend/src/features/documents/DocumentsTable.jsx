import { App, Button, Card, Drawer, Flex, Modal, Skeleton, Space, Table } from "antd";
import { useState } from "react";
import useDocuments from "./useDocuments";
import DocumentForm from "./DocumentForm";
import PermissionsGate from "../auth/PermissionsGate";
import { ROLES } from "../../config/roles";
import useDeleteDocument from "./useDeleteDocument";
import styled from "styled-components";

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    & li i {
        color: red;
        margin-right: 5px;
    }
`;

const DocumentsTable = () => {
    const { message } = App.useApp();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [modal, contextHolder] = Modal.useModal();
    const { isLoadingDocuments, documents } = useDocuments({
        selector: (data) => data?.map(i => ({
            ...i,
            projectName: i.project.name,
            project: i.project._id,
            typeName: i.type?.name,
            type: i.type?._id
        }))
    });

    const { isDeleting, deleteDocument } = useDeleteDocument();

    const columns = [
        {
            title: 'Document Name',
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
            title: 'Project',
            dataIndex: 'projectName',
            searchKey: 'projectName',
            sorter: 'projectName',
            filter: {
                type: 'text',
                filterIndex: 'projectName',
                condition: 'contains',
            }
        },
        {
            title: 'Document Type',
            dataIndex: 'typeName',
            searchKey: 'typeName',
            sorter: 'typeName',
            filter: {
                type: 'text',
                filterIndex: 'typeName',
                condition: 'contains',
            }
        },
        {
            title: 'Attachements',
            dataIndex: 'attachments',
            render: (attachments) => {
                return (
                    <List>
                        {attachments?.map((attachment, index) => <li key={index}>
                            <i className="bi bi-file-earmark-pdf"></i>
                            <a href={`/uploads/${attachment}`} target="_blank" rel="noopener noreferrer">
                                {attachment}
                            </a>
                        </li>)}
                    </List>
                )
            }
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            searchKey: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
                const { _id } = record
                return (
                    <PermissionsGate roles={[ROLES.ADMIN]}>
                        <Button type="link" onClick={() => {
                            setFormData({ type: 'update', data: record });
                            setOpen(true)
                        }}>Edit</Button>
                        <Button loading={isDeleting} type="link" danger onClick={() => {
                            modal.confirm({
                                title: 'Delete Document',
                                content: 'Are you sure you want to delete this document?',
                                onOk: () => {
                                    deleteDocument(
                                        _id,
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

    if (isLoadingDocuments) return <Skeleton />

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

                <Table dataSource={documents} columns={columns} pagination={false} scroll={{ x: 'max-content' }} />

            </Card>

            <Drawer
                closable
                destroyOnClose
                open={open}
                title='Document'
                onClose={() => {
                    setOpen(false)
                }} width={500}>
                <DocumentForm formData={formData} />
            </Drawer>

            {contextHolder}
        </Space>

    )
}

export default DocumentsTable;