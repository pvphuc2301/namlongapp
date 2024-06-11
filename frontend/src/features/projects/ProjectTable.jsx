import { App, Button, Card, Drawer, Flex, Modal, Popconfirm, Skeleton, Space, Tree } from "antd";
import { useNavigate } from "react-router-dom";
import useProjects from "./useProjects";
import { useRef, useState } from "react";
import ProjectForm from "./ProjectForm";
import useDeleteProject from './useDeleteProject';
import PermissionsGate from "../auth/PermissionsGate";
import { ROLES } from "../../config/roles";

const ProjectTable = () => {
    const ref = useRef(null);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedKey, setSelectedKey] = useState(null);
    const navigate = useNavigate();
    const [modal, contextHolder] = Modal.useModal();
    const { message } = App.useApp();

    const { isLoadingProjects, projects } = useProjects();

    const { isDeleting, deleteProject } = useDeleteProject();

    const projectTreeData = projects?.filter(p => p.type === 'main')?.map(p => ({
        key: p._id,
        title: p.name,
        imageCover: p.imageCover,
        isParent: true,
        children: projects.filter(c => c.parentId === p._id).map(c => ({ title: c.name, key: c._id, imageCover: c.imageCover, })),

    }));

    const onSelect = (_, { node }) => {
        if (!node.isParent) return
        // navigate(`./${node.key}`);
    }

    if (isLoadingProjects) return <Skeleton />

    return (
        <Space direction="vertical" size={16}>
            <Card>
                <Flex gap={4} justify="end">
                    <PermissionsGate roles={[ROLES.ADMIN]}>
                        <Button type="primary" onClick={() => {
                            setFormData({ type: 'create' });
                            setOpen(true)
                        }}>Thêm mới</Button>
                    </PermissionsGate>
                </Flex>
                <Tree
                    ref={ref}
                    showLine
                    onSelect={onSelect}
                    treeData={projectTreeData}
                    titleRender={({ imageCover, title, key, children }) => (
                        <Space size='middle'>
                            <img src={`/img/projects/${imageCover}`} alt="project" style={{ width: 40, height: 40, marginRight: 8 }} />

                            {title}

                            <PermissionsGate roles={[ROLES.ADMIN]}>
                                <Button type="link" size="small" onClick={() => {
                                    setFormData({ type: 'update', data: projects.find(p => p._id === key) })
                                    setOpen(true);
                                }}>Edit</Button>

                                <Button loading={isDeleting} disabled={children?.length > 0} danger size="small" type="link" onClick={() => {
                                    modal.confirm({
                                        title: 'Delete Project',
                                        content: 'Are you sure you want to delete this project?',
                                        onOk: () => {
                                            deleteProject(
                                                key,
                                                {
                                                    onSuccess: () => message.success('Delete successfully!'),
                                                    onError: () => message.error('Delete failed!'),
                                                }
                                            );
                                        }
                                    });
                                }}>Delete</Button>
                            </PermissionsGate>
                        </Space>)}
                />
            </Card>

            <Drawer
                closable
                destroyOnClose
                open={open}
                onClose={() => {
                    setSelectedKey(null);
                    setOpen(false)
                }} width={500}>
                <ProjectForm
                    key={`${formData.type}_${formData.data?._id}`}
                    formData={formData} />
            </Drawer>
            {contextHolder}
        </Space>
    )
}

export default ProjectTable;