import { Breadcrumb, Layout } from "antd";
import CustomersTable from "../features/customers/CustomersTable";

const Customers = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>CRM</Breadcrumb.Item>
                <Breadcrumb.Item>Customers</Breadcrumb.Item>
            </Breadcrumb>

            <CustomersTable />
        </Layout>
    )
}

export default Customers;