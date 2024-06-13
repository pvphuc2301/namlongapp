import { Transition } from "@headlessui/react";
import { Button } from "antd";
import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

const Header = styled.header`
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
`;

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    const { userInfo } = useSelector((state) => state.auth);

    console.log(showDropdown);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            console.log(dropdownRef.current);
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // setShowDropdown(false);
            }
        };

        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    return (
        <Header>
            <img style={{ height: 32, margin: 16 }} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="logo" />
            <div style={{ display: 'inline-block' }}>Nam Long Group</div>
            <div>
            </div>

            <div style={{ flexGrow: 1, textAlign: 'right', position: 'relative' }}>
                <i className="bi bi-bell-fill"></i>
                <Link to={'/me'}>
                    {
                        userInfo?.user?.photo
                            ? <img style={{ height: 20, borderRadius: '50%' }} src={`/img/users/${userInfo?.user?.photo}`} />
                            : <i className="bi bi-person-fill"></i>
                    }
                </Link>
                {/* <Button type='button' onClick={() => setShowDropdown(!showDropdown)}>
                    <img style={{ height: 20, borderRadius: '50%' }} src={`/img/users/${userInfo?.user?.photo}`} />
                </Button> */}
                {
                    showDropdown && (
                        <div ref={dropdownRef} style={{ position: 'absolute', right: 10, top: '2.5rem', backgroundColor: 'white', padding: 8, borderRadius: 4, boxShadow: '0 4px 12px rgb(0 0 0 / 15%)' }}
                        >
                            <div>
                                <img style={{ height: 32, margin: 16 }} alt="logo" />
                                <strong>{userInfo?.user?.name}</strong>
                                <div>{userInfo?.user?.email}</div>
                                <Button type='button'>Đăng xuất</Button>
                            </div>
                        </div>
                    )
                }
            </div>
        </Header>
    )
}

export default memo(Navbar);
