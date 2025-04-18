
import { getUsersAPI } from '@/services/api';
import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { App, Button, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import { CSVLink } from "react-csv";
type TSearch = {
    name: string;
    email: string;
    createdAt: string;
}
const TableUser = () => {
    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });
    const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);
    const { message, notification } = App.useApp();
    const columns: ProColumns<IUserTable>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Id',
            dataIndex: 'id',
            hideInSearch: true,
            hidden: true,
        },
        {
            title: ' Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            copyable: true
        },
        {
            title: ' Address',
            dataIndex: 'address',
        },
        {
            title: ' Age',
            dataIndex: 'age',
        },
        {
            title: ' Gender',
            dataIndex: 'gender',
        },
        {
            title: ' Avatar',
            dataIndex: 'avatar ',
        },
        {
            title: 'Update At',
            dataIndex: 'updateAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },
        {
            title: 'Activate',
            dataIndex: 'activate',
            render: (value) => (
                <Tag color={value ? 'green' : 'red'}>
                    {value ? '1' : '0'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            valueType: 'date',
            sorter: true,
            hideInSearch: true
        },

        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer", marginRight: 15 }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa user"}
                            description={"Bạn có chắc chắn muốn xóa user này ?"}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", marginLeft: 20 }}>
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    style={{ cursor: "pointer" }}
                                />
                            </span>
                        </Popconfirm>
                    </>
                )
            }
        }

    ];

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    // let query = "";
                    // if (params) {
                    //     query += `current=${params.current}&pageSize=${params.pageSize}`
                    //     if (params.email) {
                    //         query += `&email=/${params.email}/i`
                    //     }
                    //     if (params.name) {
                    //         query += `&name=/${params.name}/i`
                    //     }

                    //     const createDateRange = dateRangeValidate(params.createdAtRange);
                    //     if (createDateRange) {
                    //         query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                    //     }
                    // }

                    //default

                    // if (sort && sort.createdAt) {
                    //     query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    // } else query += `&sort=-createdAt`;


                    const res = await getUsersAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? [])
                    }
                    return {
                        data: res.data?.result,
                        page: 1,
                        success: true,
                        total: res.data?.meta.total
                    }

                }}
                rowKey="id"
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }

                headerTitle="Table user"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename='export-user.csv'
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLink>
                    ,

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                    // onClick={() => setOpenModalImport(true)}
                    >
                        Import
                    </Button>,

                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            // setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
        </>
    );
};
export default TableUser;