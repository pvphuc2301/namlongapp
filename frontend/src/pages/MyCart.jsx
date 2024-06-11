import { Breadcrumb, Layout } from "antd";
import MyCartTable from "../features/mycart/MyCartTable";

const MyCart = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Booking</Breadcrumb.Item>
                <Breadcrumb.Item>Giỏ hàng cá nhân</Breadcrumb.Item>
            </Breadcrumb>
            <MyCartTable />
        </Layout>
    )
}

export default MyCart;