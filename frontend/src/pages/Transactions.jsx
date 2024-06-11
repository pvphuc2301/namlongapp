import { Breadcrumb, Layout } from "antd";
import TransactionsTable from "../features/transactions/TransactionsTable";

const Transactions = () => {
    return (
        <Layout>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>CRM</Breadcrumb.Item>
                <Breadcrumb.Item>Transactions</Breadcrumb.Item>
            </Breadcrumb>

            <TransactionsTable />
        </Layout>
    )
}

export default Transactions;