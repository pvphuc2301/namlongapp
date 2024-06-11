import { Breadcrumb, Layout } from "antd";
import CartTable from "../features/cart/CartTable";

const Cart = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>Booking</Breadcrumb.Item>
                <Breadcrumb.Item>Giỏ hàng chung</Breadcrumb.Item>
            </Breadcrumb>
            <CartTable />
        </Layout>
    )
}

export default Cart;