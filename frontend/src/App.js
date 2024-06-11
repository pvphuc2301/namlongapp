import { Button, Layout, Menu, Result, Spin } from 'antd';
import React, { Suspense, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import createStore from './redux/store';
// import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import { ROLES } from './config/roles';
import PersistLogin from './features/auth/PersistLogin';
import RequiredAuth from './features/auth/RequireAuth';
import Cart from './pages/Cart';
import ChangePassword from './pages/ChangePassword';
import Customers from './pages/Customers';
import DocumentType from './pages/DocumentType';
import Documents from './pages/Documents';
import ForgetPassword from './pages/ForgetPassword';
import Home from './pages/Home';
import MyCart from './pages/MyCart';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Requests from './pages/Requests';
import ResetPassword from './pages/ResetPassword';
import SignUp from './pages/SignUp';
import SoldCart from './pages/SoldCart';
import Transactions from './pages/Transactions';
import User from './pages/User';
import WaitingCart from './pages/WaitingCart';
import FileViewer from './pages/FileViewer';

const { Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Dashboard', '1'),
  getItem('CRM', 'CRM', null, [
    getItem(<Link to={'/crm/customers'}>Customers</Link>, 'CRM_CUSTOMERS', <i className="bi bi-person"></i>),
    getItem(<Link to={'/crm/transactions'}>Transactions</Link>, 'CRM_TRANSACTIONS', <i className="bi bi-person"></i>),
  ]),
  getItem('Booking', '2', null, [
    getItem(<Link to={'/sold-cart'}>Căn đã bán</Link>, 'booking_sold_cart', <i className="bi bi-cart"></i>),
    getItem(<Link to={'/my-cart'}>Giỏ hàng cá nhân</Link>, '3', <i className="bi bi-cart"></i>),
    getItem(<Link to={'/waiting-cart'}>Giỏ hàng chờ duyệt</Link>, '4', <i className="bi bi-cart"></i>),
    getItem(<Link to={'/cart'}>Giỏ hàng chung</Link>, '5', <i className="bi bi-cart"></i>),
    getItem(<Link to={'/projects'}>Project</Link>, '7', <i className="bi bi-person"></i>),
    getItem(<Link to={'/documents'}>Documents</Link>, 'system_documents', <i className="bi bi-person"></i>),
    getItem(<Link to={'/document-type'}>Document Type</Link>, 'system_document_type', <i className="bi bi-person"></i>),
    getItem(<Link to={'/requests'}>Requests</Link>, 'system_request', <i className="bi bi-file-earmark"></i>),
  ]),
  getItem('System', 'sub1', null, [
    getItem(<Link to={'/user'}>User</Link>, '6', <i className="bi bi-person"></i>),
  ]),
  getItem(<Link to={'/me'}>Profile</Link>, 'PROFILE', <i className="bi bi-person-vcard"></i>),
];

const SharedLayout = () => {
  return (
    <Layout>
      <Navbar />
      <Content style={{ margin: '0 16px' }}>
        <Layout>
          <Sider>
            <Menu style={{ height: '100%' }} defaultSelectedKeys={['1']} mode="inline" items={items} />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Outlet />
          </Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  )
}

const App = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const [store, setStore] = React.useState({});

  useEffect(() => {
    const init = async () => {
      try {
        const store = await createStore();
        setStore(store);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading || error) return (
    <>
      {
        loading ? <Spin /> : <Result status="error" title={error} subTitle="Sorry, something went wrong." extra={<Button type="primary"> Retry </Button>} />
      }
    </>
  )

  return (
    <Provider store={store}>
      <Suspense fallback={<Spin />}>
        <Routes>
          <Route path='/' element={<SharedLayout />}>
            <Route element={<PersistLogin />}>
              <Route path='/' element={<Home />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/sold-cart' element={<SoldCart />} />
              <Route path='/my-cart' element={<MyCart />} />
              <Route path='/waiting-cart' element={<WaitingCart />} />
              <Route path='/projects' element={<Projects />} />
              <Route path='/documents' element={<Documents />} />
              <Route path='/document-type' element={<DocumentType />} />
              <Route path='/requests' element={<Requests />} />

              <Route path='/me' element={<Profile />} />
              <Route path='/change-password' element={<ChangePassword />} />

              <Route element={<RequiredAuth allowedRoles={[ROLES.ADMIN]} />} >
                <Route path='/user' element={<User />} />
              </Route>

              <Route path='/crm/customers' element={<Customers />} />
              <Route path='/crm/transactions' element={<Transactions />} />

            </Route>
          </Route>

          <Route element={<PersistLogin />}>
            <Route path='/uploads/:fileName' element={<FileViewer />} />
          </Route>

          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />

          <Route path="*" element={<Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Link to={"/"} >Back Home</Link>}
          />} />
        </Routes>
      </Suspense>
    </Provider >
  )
}

export default App;