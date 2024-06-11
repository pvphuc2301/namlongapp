import { Breadcrumb, Layout } from "antd";
import WaitingCartTable from "../features/waitingCart/WaitingCartTable";

const WaitingCart = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Booking</Breadcrumb.Item>
                <Breadcrumb.Item>Giỏ hàng chờ duyệt</Breadcrumb.Item>
            </Breadcrumb>
            <WaitingCartTable />
        </Layout>
    )
}

export default WaitingCart;