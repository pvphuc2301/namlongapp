import { Transition } from "@headlessui/react";
import { Button, Flex, Tag } from "antd";
import { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logoNamlong from "../logo-nlg.jpg";
import { useAuth0 } from "@auth0/auth0-react";
import { selectCurrentUser } from "../redux/slices/authSlice";

const Header = styled.header`
  display: flex;
  align-items: center;
  background-color: #910d10;
  /* justify-content: space-between; */
`;

const Avatar = styled.img`
    height: 34px;
    border-radius: 50%;
    border: 2px solid #fff;
`;

const LogoWrapper = styled.div`
    background-color: #fff;

    & img {
        height: 57px;
        margin: 0 16px;
    }
`;

const StyledLink = styled(Link)`
    color: #fff;
    text-decoration: none;

    &:hover {
        color: #fff;
        background-color: blue;
    }
`;

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef(null);

    const userInfo = useSelector(selectCurrentUser);

    console.log(userInfo);

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
            <LogoWrapper><img src={logoNamlong} alt="logo" /></LogoWrapper>
            <div style={{ flex: 1 }} />

            <div style={{ textAlign: 'right', position: 'relative', backgroundColor: '#910d10', marginRight: 16 }}>
                <StyledLink to={'/me'}>
                    <Flex gap={8} align="center">
                        <Avatar src={`/img/users/${userInfo?.photo ?? 'default.jpeg'}`} alt={userInfo?.name}></Avatar>
                        <div>{userInfo?.email}</div>
                    </Flex>
                </StyledLink>
                {/* <Button type='button' onClick={() => setShowDropdown(!showDropdown)}>
                    <img style={{ height: 20, borderRadius: '50%' }} src={`/img/users/${userInfo?.user?.photo}`} />
                </Button> */}
                {
                    showDropdown && (
                        <div ref={dropdownRef} style={{ position: 'absolute', right: 10, top: '2.5rem', backgroundColor: 'white', padding: 8, borderRadius: 4, boxShadow: '0 4px 12px rgb(0 0 0 / 15%)' }}
                        >
                            <div>
                                <img style={{ height: 32, margin: 16 }} alt="logo" />
                                <strong>{userInfo?.name}</strong>
                                <div>{userInfo?.email}</div>
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
