import { Breadcrumb, Layout } from "antd";
import RequestsTable from "../features/requests/RequestsTable";

const Requests = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Booking</Breadcrumb.Item>
                <Breadcrumb.Item>Requests</Breadcrumb.Item>
            </Breadcrumb>

            <RequestsTable />
        </Layout>
    )
}

export default Requests;