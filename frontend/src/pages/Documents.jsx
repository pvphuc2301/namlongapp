import { Breadcrumb, Layout } from "antd";
import DocumentsTable from "../features/documents/DocumentsTable";

const Documents = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>System</Breadcrumb.Item>
                <Breadcrumb.Item>Documents</Breadcrumb.Item>
            </Breadcrumb>

            <DocumentsTable />
        </Layout>
    )
}

export default Documents;