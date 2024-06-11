import { Breadcrumb, Layout } from "antd";
import ProjectTable from "../features/projects/ProjectTable";

const Projects = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Tiện Ích</Breadcrumb.Item>
                <Breadcrumb.Item>Quản Lý Dự Án</Breadcrumb.Item>
            </Breadcrumb>
            <ProjectTable />
        </Layout>
    )
}

export default Projects;