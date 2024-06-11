import {
    App, Button, Checkbox, DatePicker, Flex, Form, Input, Select, Skeleton, Tabs, Upload
} from "antd"
import dayjs from "dayjs";
import { useState } from "react";

import useUpdateCustomer from "./useUpdateCustomer";
import useCreateCustomer from './useCreateCustomer';
import useBanks from "../banks/useBanks";
import useUsers from "../users/useUsers";
import { FormProvider } from "antd/es/form/context";

const CustomerForm = ({ formData = {} }) => {
    const [formInstance, setFormInstance] = useState(formData);
    const [form] = Form.useForm();
    const { message } = App.useApp();

    const { isLoadingBanks, banks } = useBanks({
        selector: (banks) => banks.map((bank) => ({
            label: bank?.name,
            value: bank?.id,
            logo: bank?.logo
        }))
    });

    const { isLoadingUsers, users } = useUsers({
        selector: (users) => users.map((user) => ({
            label: `${user?.name} (${user?.email})`,
            value: user?._id,
        }))
    });

    const genderOptions = [
        {
            label: "Male",
            value: "male"
        },
        {
            label: "Female",
            value: "female"
        }
    ]

    const [photo, setPhoto] = useState(() => {
        return [{
            uid: 1,
            name: formData?.data?.photo,
            status: 'done',
            url: `/img/customers/${formData?.data?.photo ?? 'default.jpeg'}`,
        }]
    });

    const [identityCardFront, setIdentityCardFront] = useState(() => {
        return formData?.data?.identityCardFront ? [{
            uid: 1,
            name: formData?.data?.identityCardFront,
            status: 'done',
            url: `/img/customers/${formData?.data?.identityCardFront}`,
        }] : []
    });

    const [identityCardBack, setIdentityCardBack] = useState(() => {
        return formData?.data?.identityCardBack ? [{
            uid: 1,
            name: formData?.data?.identityCardBack,
            status: 'done',
            url: `/img/customers/${formData?.data?.identityCardBack}`,
        }] : []
    });

    const { isCreating, createCustomer } = useCreateCustomer();
    const { isUpdating, updateCustomer } = useUpdateCustomer();

    const isWorking = isCreating || isUpdating;

    const isLoading = isLoadingBanks || isLoadingUsers;

    if (isLoading) return <Skeleton />

    const onFinish = (name, { values }) => {

        const formData = new FormData();

        if (name === 'general') {
            formData.append('firstName', values.firstName);
            formData.append('lastName', values.lastName);

            formData.append('gender', values.gender ?? '');

            formData.append('dob', values.dob?.format('YYYY-MM-DD') ?? '');
            formData.append('email', values.email);
            formData.append('phone', values.phone ?? '');

            formData.append('sale', values.sale);

            if (photo.length > 0 && photo[0]?.originFileObj) {
                formData.append('photo', photo[0]?.originFileObj);
            }


            formData.append('note', values.note ?? '');
            formData.append('active', values.active);
        }

        if (name === 'identityCard') {

            formData.append('currentAddress', values.currentAddress ?? '');
            formData.append('permanentAddress', values.permanentAddress ?? '');
            formData.append('identityCard', values.identityCard ?? '');
            formData.append('issuedDate', values.issuedDate?.format('YYYY-MM-DD') ?? '');
            formData.append('issuedBy', values.issuedBy ?? '');

            if (identityCardFront.length > 0 && identityCardFront[0]?.originFileObj) {
                formData.append('identityCardFront', identityCardFront[0]?.originFileObj);
                console.log(identityCardFront[0]?.originFileObj)
            }

            if (identityCardBack.length > 0 && identityCardBack[0]?.originFileObj) {
                formData.append('identityCardBack', identityCardBack[0]?.originFileObj);
                console.log(identityCardFront[0]?.originFileObj)
            }
        }

        if (name === 'bank') {
            formData.append('accountNumber', values.accountNumber ?? '');
            formData.append('bankId', values.bankId ?? '');
            formData.append('bankBranch', values.bankBranch ?? '');

        }

        if (formInstance.type === 'create') {
            createCustomer(formData, {
                onSuccess: (data) => {
                    message.success('Create customer successfully');

                    console.log(data.data.data.data)

                    setFormInstance({
                        type: 'update',
                        data: data.data.data.data
                    })
                },
                onError: () => {
                    message.error('Create customer failed');
                }
            })
        }

        if (formInstance.type === 'update') {
            updateCustomer(
                {
                    id: formInstance?.data?._id,
                    data: formData
                },
                {
                    onSuccess: () => {
                        message.success('Update customer successfully');
                    },
                    onError: () => {
                        message.error('Update customer failed');
                    }
                }
            )
        }
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
    return (
        <>
            <FormProvider
                onFormFinish={onFinish}
            >
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="General" key="1">
                        <Form
                            form={form}
                            name="general"
                            initialValues={{
                                ...formData?.data,
                                active: formData?.data?.active ?? true,
                                dob: dayjs(formData?.data?.dob),
                                issuedDate: dayjs(formData?.data?.issuedDate),
                            }}
                            layout="vertical"
                        >
                            <Form.Item name='photo' label="Photo">
                                <Upload
                                    beforeUpload={async (file) => {
                                        setPhoto([...photo, file]);
                                        return false
                                    }}
                                    onRemove={(file) => {
                                        const index = photo.indexOf(file);
                                        const newPhoto = photo.slice();
                                        newPhoto.splice(index, 1);
                                        setPhoto(newPhoto);
                                    }}
                                    listType="picture-card"
                                    fileList={photo}
                                    // onPreview={handlePreview}
                                    onChange={({ fileList }) => setPhoto(fileList)}
                                    accept="image/*">
                                    {photo.length >= 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>

                            <Form.Item name='firstName'
                                label="First name"
                                rules={[{ required: true, message: '${label} is required' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name='lastName'
                                label="Last Name"
                                rules={[{ required: true, message: 'Please input your last name!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name='gender' label="Gender">
                                <Select allowClear options={genderOptions} />
                            </Form.Item>

                            <Form.Item name='dob' label="Date of birth"
                                rules={[{ type: 'object' }]}>
                                <DatePicker format="DD-MM-YYYY" />
                            </Form.Item>

                            <Form.Item name='email' label="Email"
                                rules={[{ type: 'email', required: true, message: 'Please input your email!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name='phone' label="Phone">
                                <Input />
                            </Form.Item>

                            <Form.Item name='currentAddress' label="Current Address">
                                <Input />
                            </Form.Item>

                            <Form.Item name='permanentAddress' label="Permanent Address">
                                <Input />
                            </Form.Item>

                            <Form.Item name='note' label="Note">
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item name='sale' label="Sale"
                                rules={[{ required: true, message: '${label} is required' }]}>
                                <Select
                                    showSearch
                                    allowClear
                                    optionFilterProp="label"
                                    options={users}
                                />
                            </Form.Item>

                            <Form.Item valuePropName="checked" name='active'>
                                <Checkbox>Active</Checkbox>
                            </Form.Item>

                            <Button type="primary"
                                htmlType="submit"
                                loading={isWorking}>
                                Save
                            </Button>
                        </Form>
                    </Tabs.TabPane>

                    <Tabs.TabPane disabled={formInstance?.type === 'create'} tab="Identity Card" key="2">
                        <Form
                            form={form}
                            name="identityCard"
                            initialValues={{
                                ...formInstance?.data,
                            }}
                            // onFinish={onFinish}
                            layout="vertical"
                        >
                            <Form.Item name='identityCard' label="Identity Card"
                                rules={[{ required: true, message: 'Please input your identity card!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item name='issuedDate' label="Issue date"
                                rules={[{ type: 'object', required: true, message: 'Please input your issue date!' }]}>
                                <DatePicker format="DD-MM-YYYY" />
                            </Form.Item>

                            <Form.Item name='issuedBy' label="Issue By" rules={[{ required: true, message: 'Please input your issue by!' }]}>
                                <Input />
                            </Form.Item>

                            <Flex justify="space-between">
                                <Form.Item name='identityCardFront' label="Front">
                                    <Upload
                                        beforeUpload={async (file) => {
                                            setIdentityCardFront([...identityCardFront, file]);
                                            return false
                                        }}
                                        onRemove={(file) => {
                                            const index = identityCardFront.indexOf(file);
                                            const newidentityCardFront = identityCardFront.slice();
                                            newidentityCardFront.splice(index, 1);
                                            setIdentityCardFront(newidentityCardFront);
                                        }}
                                        listType="picture-card"
                                        fileList={identityCardFront}
                                        // onPreview={handlePreview}
                                        onChange={({ fileList }) => setIdentityCardFront(fileList)}
                                        accept="image/*">
                                        {identityCardFront.length >= 1 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                                <Form.Item name='identityCardBack' label="Back">
                                    <Upload
                                        beforeUpload={async (file) => {
                                            setIdentityCardBack([...identityCardBack, file]);
                                            return false
                                        }}
                                        onRemove={(file) => {
                                            const index = identityCardBack.indexOf(file);
                                            const newidentityCardBack = identityCardBack.slice();
                                            newidentityCardBack.splice(index, 1);
                                            setIdentityCardBack(newidentityCardBack);
                                        }}
                                        listType="picture-card"
                                        fileList={identityCardBack}
                                        // onPreview={handlePreview}
                                        onChange={({ fileList }) => setIdentityCardBack(fileList)}
                                        accept="image/*">
                                        {identityCardBack.length >= 1 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Flex>

                            <Button type="primary"
                                htmlType="submit"
                                loading={isWorking}>
                                Save
                            </Button>
                        </Form>
                    </Tabs.TabPane>

                    <Tabs.TabPane disabled={formInstance?.type === 'create'} tab="Bank" key="3">
                        <Form
                            form={form}
                            name="bank"
                            initialValues={{
                                ...formInstance?.data
                            }}
                            // onFinish={onFinish}
                            layout="vertical"
                        >

                            <Form.Item name='accountNumber' label="Account Number">
                                <Input />
                            </Form.Item>

                            <Form.Item name='bankId' label="Bank Id">
                                <Select
                                    showSearch
                                    allowClear
                                    optionFilterProp="label"
                                    options={banks}
                                    optionRender={({ data }) => {
                                        return <Flex align="center"><img src={`${data?.logo}`} style={{ height: 30, marginRight: 10 }} /> {data?.label}</Flex>
                                    }}
                                />
                            </Form.Item>

                            <Form.Item name='bankBranch' label="Bank Branch">
                                <Input />
                            </Form.Item>

                            <Button type="primary"
                                htmlType="submit"
                                loading={isWorking}>
                                Save
                            </Button>
                        </Form>
                    </Tabs.TabPane>

                    <Tabs.TabPane disabled={formInstance?.type === 'create'} tab="Transaction" key="4">
                    </Tabs.TabPane>

                    <Tabs.TabPane disabled={formInstance?.type === 'create'} tab="History" key="5">

                    </Tabs.TabPane>
                </Tabs>
            </FormProvider>

        </>
    )
}

export default CustomerForm;