import { Breadcrumb, Layout } from "antd";
import DocumentTypeTable from "../features/documentType/DocumentTypeTable";

const DocumentType = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>System</Breadcrumb.Item>
                <Breadcrumb.Item>Document Type</Breadcrumb.Item>
            </Breadcrumb>

            <DocumentTypeTable />
        </Layout>
    )
}

export default DocumentType;