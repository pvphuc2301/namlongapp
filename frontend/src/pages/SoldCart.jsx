import { Breadcrumb, Layout } from "antd";
import SoldCartTable from "../features/soldCart/SoldCartTable";

const SoldCart = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Booking</Breadcrumb.Item>
                <Breadcrumb.Item>Căn đã bán</Breadcrumb.Item>
            </Breadcrumb>
            <SoldCartTable />
        </Layout>
    )
}

export default SoldCart;