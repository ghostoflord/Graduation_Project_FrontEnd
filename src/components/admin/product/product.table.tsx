
import { useRef, useState } from 'react';
import { Popconfirm, Button, App } from 'antd';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { getProductsAPI } from '@/services/api';
type TSearch = {
    name: string;
    author: string;
    createdAt: string;
    createdAtRange: string;
    updatedAt: string;
    updatedAtRange: string;
    price: number;
}
const TableProduct = () => {

    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    // const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    // const [dataViewDetail, setDataViewDetail] = useState<IProductTable | null>(null);

    // const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IProductTable[]>([]);

    // const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    // const [dataUpdate, setDataUpdate] = useState<IProductTable | null>(null);

    // const [isDeleteBook, setIsDeleteBook] = useState<boolean>(false);
    const { message, notification } = App.useApp();


    // const handleDeleteBook = async (_id: string) => {
    //     setIsDeleteBook(true)
    //     const res = await deleteBookAPI(_id);
    //     if (res && res.data) {
    //         message.success('Xóa book thành công');
    //         refreshTable();
    //     } else {
    //         notification.error({
    //             message: 'Đã có lỗi xảy ra',
    //             description: res.message
    //         })
    //     }
    //     setIsDeleteBook(false)
    // }

    // const refreshTable = () => {
    //     actionRef.current?.reload();
    // }

    const columns: ProColumns<IProductTable>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            hideInSearch: true,
            // render(dom, entity, index, action, schema) {
            //     return (
            //         <a href='#' onClick={() => {
            //             setDataViewDetail(entity);
            //             setOpenViewDetail(true);
            //         }}>{entity._id}</a>
            //     )
            // },
            // id: string;
            // image: string;
            // name: string;
            // price: number;
            // sold: number;
            // quantity: number;
            // detailDescription: string;
            // productCode: string;
            // shortDescription: string;
        },
        {
            title: 'Tên sách',
            dataIndex: 'name',
            sorter: true
        },
        {
            title: 'Miêu Tả',
            dataIndex: 'detailDescription',
            hideInSearch: true,
        },
        {
            title: 'MÃ Sản Phẩm',
            dataIndex: 'productCode',
            sorter: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            hideInSearch: true,
            sorter: true,
            // https://stackoverflow.com/questions/37985642/vnd-currency-formatting
            render(dom, entity, index, action, schema) {
                return (
                    <>{new Intl.NumberFormat(
                        'vi-VN',
                        { style: 'currency', currency: 'VND' }).format(entity.price)}
                    </>
                )
            }
        },
        // {
        //     title: 'Ngày cập nhật',
        //     dataIndex: 'updatedAt',
        //     sorter: true,
        //     valueType: 'date',
        //     hideInSearch: true
        // },

        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 10px" }}
                        // onClick={() => {
                        //     setOpenModalUpdate(true);
                        //     setDataUpdate(entity);
                        // }}
                        />

                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa book"}
                            description={"Bạn có chắc chắn muốn xóa book này ?"}
                            // onConfirm={() => handleDeleteBook(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        // okButtonProps={{ loading: isDeleteBook }}
                        >
                            <span style={{ cursor: "pointer" }}>
                                <DeleteTwoTone twoToneColor="#ff4d4f" />
                            </span>
                        </Popconfirm>


                    </>

                )
            }
        }
    ];

    return (
        <>
            <ProTable<IProductTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort, filter) => {
                    let query = "";
                    if (params) {
                        query += `current=${params.current}&pageSize=${params.pageSize}`
                        if (params.name) {
                            query += `&name=/${params.name}/i`
                        }
                        // if (params.author) {
                        //     query += `&author=/${params.author}/i`
                        // }

                        // const createDateRange = dateRangeValidate(params.createdAtRange);
                        // if (createDateRange) {
                        //     query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`
                        // }

                    }


                    // if (sort && sort.createdAt) {
                    //     query += `&sort=${sort.createdAt === "ascend" ? "createdAt" : "-createdAt"}`
                    // } else query += `&sort=-createdAt`;

                    // if (sort && sort.mainText) {
                    //     query += `&sort=${sort.mainText === "ascend" ? "mainText" : "-mainText"}`
                    // }

                    // if (sort && sort.author) {
                    //     query += `&sort=${sort.author === "ascend" ? "author" : "-author"}`
                    // }
                    // if (sort && sort.price) {
                    //     query += `&sort=${sort.price === "ascend" ? "price" : "-price"}`
                    // }

                    const res = await getProductsAPI(query);
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
                rowKey="_id"
                pagination={
                    {
                        current: meta.current,
                        pageSize: meta.pageSize,
                        showSizeChanger: true,
                        total: meta.total,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                    }
                }

                headerTitle="Table Product"
                toolBarRender={() => [
                    <CSVLink
                        data={currentDataTable}
                        filename='export-book.csv'
                    >
                        <Button
                            icon={<ExportOutlined />}
                            type="primary"
                        >
                            Export
                        </Button>
                    </CSVLink >
                    ,

                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        // onClick={() => {
                        //     setOpenModalCreate(true);
                        // }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />

            {/* < DetailBook
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateBook
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            /> */}
        </>
    )
}


export default TableProduct;