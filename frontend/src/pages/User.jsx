import { Breadcrumb, Layout } from "antd";
import UserTable from '../features/users/UserTable';

const User = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>System</Breadcrumb.Item>
                <Breadcrumb.Item>Users</Breadcrumb.Item>
            </Breadcrumb>
            <UserTable />
        </Layout>
    )
}

export default User;