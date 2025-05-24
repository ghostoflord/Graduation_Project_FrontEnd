import {
    FooterToolbar,
    ProCard,
    ProTable,
} from "@ant-design/pro-components";
import { ActionType } from "@ant-design/pro-components";
import {
    Col,
    Form,
    Input,
    InputNumber,
    Modal,
    Row,
    message,
    notification,
    Button,
} from "antd";
import { isMobile } from 'react-device-detect';
import { CheckSquareOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import ModuleApi from "./module.api";
import { callCreateRole, callFetchRoles, callUpdateRole } from "@/services/api";

interface IProps {
    listPermissions: {
        module: string;
        permissions: IPermission[]
    }[];
}

const TableRole = ({ listPermissions }: IProps) => {
    const [openModal, setOpenModal] = useState(false);
    const [singleRole, setSingleRole] = useState<IRole | null>(null);
    const [form] = Form.useForm();
    const actionRef = useRef<ActionType>();
    console.log("listPermissions", listPermissions)
    const reloadTable = () => {
        actionRef.current?.reload();
    };

    const submitRole = async () => {
        const valuesForm = await form.validateFields();
        const { description, name, permissions } = valuesForm;
        const checkedPermissions = [];

        if (permissions) {
            for (const key in permissions) {
                if (key.match(/^[1-9][0-9]*$/) && permissions[key] === true) {
                    checkedPermissions.push({ id: key });
                }
            }
        }

        const role = {
            name,
            description,
            permissions: checkedPermissions,
        };

        let res;
        if (singleRole?.id) {
            res = await callUpdateRole(role, singleRole.id);
        } else {
            res = await callCreateRole(role);
        }

        if (res?.data) {
            message.success(`${singleRole?.id ? "Cập nhật" : "Thêm mới"} role thành công`);
            handleReset();
            reloadTable();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message,
            });
        }
    };

    const handleReset = () => {
        form.resetFields();
        setOpenModal(false);
        setSingleRole(null);
    };

    return (
        <>
            <ProTable<IRole>
                rowKey="id"
                actionRef={actionRef}
                columns={[
                    {
                        title: 'Id',
                        dataIndex: 'id',
                        width: 80,
                        render: (text, record, index, action) => {
                            return (
                                <span>
                                    {record.id}
                                </span>
                            )
                        },
                        hideInSearch: true,
                    },
                    {
                        title: "Tên vai trò",
                        dataIndex: "name",
                    },
                    {
                        title: "Mô tả",
                        dataIndex: "description",
                    },
                    {
                        title: "Ngày tạo",
                        dataIndex: "createdAt",
                    },
                    {
                        title: "Hành động",
                        valueType: "option",
                        render: (_, record) => [
                            <a
                                key="edit"
                                onClick={() => {
                                    setSingleRole(record);
                                    form.setFieldsValue(record);
                                    setOpenModal(true);
                                }}
                            >
                                Cập nhật
                            </a>,
                        ],
                    },
                ]}
                request={async (params) => {
                    const query = `page=${params.current - 1}&size=${params.pageSize}`;
                    const res = await callFetchRoles(query);
                    if (res?.data) {
                        return {
                            data: res.data.result,
                            total: res.data.meta.total,
                            success: true,
                        };
                    }
                    return {
                        data: [],
                        success: false,
                    };
                }}
                pagination={{
                    pageSize: 5,
                }}
                search={false}
            />

            <Modal
                title={<>{singleRole?.id ? "Cập nhật Role" : "Tạo mới Role"}</>}
                open={openModal}
                onCancel={handleReset}
                afterClose={handleReset}
                width={isMobile ? "100%" : 900}
                destroyOnClose
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={handleReset} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            icon={<CheckSquareOutlined />}
                            onClick={submitRole}
                        >
                            {singleRole?.id ? "Cập nhật" : "Tạo mới"}
                        </Button>
                    </div>
                }

            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col lg={12} md={12} sm={24} xs={24}>
                            <Form.Item
                                label="Tên Role"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            >
                                <Input placeholder="Nhập name" />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Miêu tả"
                                name="description"
                                rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            >
                                <Input.TextArea placeholder="Nhập miêu tả role" autoSize={{ minRows: 2 }} />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <ProCard
                                title="Quyền hạn"
                                subTitle="Các quyền hạn được phép cho vai trò này"
                                headStyle={{ color: '#d81921' }}
                                style={{ marginBottom: 20 }}
                                headerBordered
                                size="small"
                                bordered
                            >
                                <ModuleApi
                                    form={form}
                                    listPermissions={listPermissions}
                                    singleRole={singleRole}
                                    openModal={openModal}
                                />
                            </ProCard>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default TableRole;