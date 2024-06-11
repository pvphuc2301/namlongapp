import useUpdateUser from '../auth/useUpdateUser';
import { Button, Card, Col, Flex, Form, Input, Row, Skeleton, Tabs, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useUpdateMyPassword from '../auth/useUpdateMyPassword';
import { App } from 'antd';
import useProfile from '../auth/useProfile';
import useLogout from '../auth/useLogout';
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from '../../redux/slices/authSlice'

const MyProfile = () => {
    const { message } = App.useApp();
    const [photo, setPhoto] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, profile } = useProfile();

    const { isUpdatingUser, updateUser } = useUpdateUser();

    const { isPasswordUpdating, updatePassword } = useUpdateMyPassword();

    const { isSigningOut, logout } = useLogout();

    useEffect(() => {
        if (profile?.photo) setPhoto((prev) => [{ ...prev[0], url: `/img/users/${profile?.photo}` }])
    }, [profile?.photo]);

    const onFinish = (data) => {
        const formData = new FormData();

        if (photo.length > 0 && photo[0]?.originFileObj) {
            formData.append("photo", photo[0]?.originFileObj);
        }

        formData.append("name", data.name);
        formData.append("email", data.email);

        updateUser(formData, {
            onSuccess: () => {
                message.success("Update success");
            },
            onError: (error) => {
                message.error(error?.response.data?.message);
            }
        });
    }

    const uploadButton = (
        <button style={{
            border: 0,
            background: 'none',
        }} type="button">
            <div
                style={{
                    marginTop: 8,
                }}
            >
                <i className="bi bi-upload"></i> Upload
            </div>
        </button>
    )

    const handleLogout = () => {
        logout(
            undefined,
            {
                onSuccess: () => {
                    message.success("Logout success");
                    dispatch(logoutAction());
                    navigate("/login");
                },
            });
    }

    const handlePasswordUpdate = (formData) => {

        updatePassword(
            formData,
            {
                onSuccess: () => {
                    message.success("Update success");
                },
                onError: (error) => {
                    message.error(error?.response.data?.message);
                }
            });
    }

    if (isLoading) return <Skeleton />

    return (
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Profile" key="1">
                <Card>
                    <Form layout="vertical" initialValues={profile} onFinish={onFinish}>
                        <Form.Item name='photo' label="Photo">
                            <Upload
                                beforeUpload={async (file) => {
                                    setPhoto([file]);
                                    return false
                                }}
                                onRemove={(file) => {
                                    const index = photo.indexOf(file);
                                    const newPhoto = photo.slice();
                                    newPhoto.splice(index, 1);
                                    setPhoto(newPhoto);
                                }}
                                accept="image/*"
                                listType="picture-card"
                                // onPreview={handlePreview}
                                fileList={photo}
                                onChange={({ fileList }) => setPhoto(fileList)}
                            >
                                {photo.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ]}>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}>
                            <Input type="email" />
                        </Form.Item>
                        <Flex gap={8}>
                            <Button type='primary' loading={isUpdatingUser} htmlType="submit">Save</Button>
                            <Button type='link'
                                danger
                                loading={isSigningOut}
                                onClick={handleLogout}>
                                <i style={{ marginRight: 8 }} className="bi bi-box-arrow-right"></i> Sign out
                            </Button>
                        </Flex>
                    </Form>
                </Card>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Password" key="2">
                <Card>
                    <Form onFinish={handlePasswordUpdate} layout="vertical">
                        <Form.Item
                            label="Current password"
                            name="passwordCurrent"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your current password!',
                                },
                            ]}>
                            <Input type="password" placeholder="********" />
                        </Form.Item>

                        <Form.Item
                            label="New password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your new password!',
                                },
                            ]}>
                            <Input type="password" placeholder="********" />
                        </Form.Item>

                        <Form.Item
                            label="Confirm new password"
                            name="passwordConfirm"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your new password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The new password that you entered do not match!'));
                                    },
                                }),
                            ]}>
                            <Input type="password" placeholder="********" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={isPasswordUpdating}>Update password</Button>
                    </Form>
                </Card>
            </Tabs.TabPane>
        </Tabs>
    )
}

export default MyProfile;