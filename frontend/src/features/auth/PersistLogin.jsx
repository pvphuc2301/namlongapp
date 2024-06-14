import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { selectCurrentToken } from '../../redux/slices/authSlice';
import useRefresh from './useRefresh';
import { Result, Spin } from 'antd';

const PersistLogin = () => {

    const [persistedToken, setPersistedToken] = useState(true);
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const [trueSuccess, setTrueSuccess] = useState(false);

    const { refresh, isLoading, isSuccess, isError, error, isIdle } = useRefresh();

    useEffect(() => {
        // if (effectRan.current === true || process.env.NODE_ENV !== 'production') {

        // }

        // console.log('persisted token', persistedToken);
        // console.log('token', token);
        if (!token && persistedToken) {
            refresh(
                undefined,
                {
                    onSuccess: () => setTrueSuccess(true),
                    onError: () => setTrueSuccess(false),
                    onSettled: () => setPersistedToken(true)
                }
            );
        }

        return () => effectRan.current = true
    }, [])

    let content

    if (!persistedToken) { // no persistence
        // console.log('no persistence');
        content = <Outlet />
    } else if (isLoading) { // persistence but no token
        // console.log('loading');
        content = <Spin />
    } else if (isError) { // persistence but no token
        // console.log('error');
        content = <Result status="error" title="Error" subTitle={error.message} extra={[<Link to="/login">Login</Link>]} />
        // content = <p>{`${error.message} `} <Link to="/login">Login</Link></p>
    } else if (isSuccess && trueSuccess) { // persistence and token
        // console.log('success');
        content = <Outlet />
    } else if (token && isIdle) { // persistence and token
        // console.log('default');
        content = <Outlet />
    }

    // console.log('content', content);

    return content
}

export default PersistLogin;