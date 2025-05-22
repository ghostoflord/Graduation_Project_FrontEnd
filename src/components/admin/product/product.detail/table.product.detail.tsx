import { useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { deleteProductDetailAPI, getAllProductDetailsAPI, getProductDetailAPI } from '@/services/api';
import DetailProduct from '../detail.product';
import DetailOfProduct from './detail.of.product';
import { Button, message, notification, Popconfirm } from 'antd';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import CreateProductDetail from './create.product.detail';
import UpdateProductDetail from './update.product.detail';
const TableProductDetail = () => {
    const actionRef = useRef<ActionType>();

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<ProductDetail | null>(null);

    const [openViewDetailSpecification, setOpenViewDetailSpecification] = useState<boolean>(false);
    const [dataViewDetailSpecification, setDataViewDetailSpecification] = useState<ProductDetail | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<ProductDetail | null>(null);

    const [isDeleteProduct, setIsDeleteProduct] = useState<boolean>(false);

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const handleDeleteProduct = async (id: string) => {
        setIsDeleteProduct(true)
        try {
            const res = await deleteProductDetailAPI(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xóa user thành công');
                refreshTable();
            } else {
                notification.error({
                    message: res.error || 'Đã có lỗi xảy ra',
                    description: res.message || 'Không thể xóa user'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xóa user'
            });
        } finally {
            setIsDeleteProduct(false);
        }
    }


    const refreshTable = () => {
        actionRef.current?.reload();
    }

    const columns: ProColumns<ProductDetail>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetailSpecification(entity);
                        setOpenViewDetailSpecification(true);
                    }}>{entity.id}</a>
                )
            },
        },
        {
            title: 'CPU',
            dataIndex: 'cpu',
        },
        {
            title: 'RAM',
            dataIndex: 'ram',
        },
        {
            title: 'Storage',
            dataIndex: 'storage',
        },
        {
            title: 'GPU',
            dataIndex: 'gpu',
        },
        {
            title: 'Màn hình',
            dataIndex: 'screen',
        },
        {
            title: 'Pin',
            dataIndex: 'battery',
        },
        {
            title: 'Trọng lượng',
            dataIndex: 'weight',
        },
        {
            title: 'Chất liệu',
            dataIndex: 'material',
        },
        {
            title: 'Hệ điều hành',
            dataIndex: 'os',
        },
        {
            title: 'Tính năng đặc biệt',
            dataIndex: 'specialFeatures',
        },
        {
            title: 'Cổng kết nối',
            dataIndex: 'ports',
        },
        {
            title: 'Product Id',
            dataIndex: 'productId',
            hideInSearch: true,
            render(_, entity) {
                return (
                    <a
                        href="#"
                        onClick={async (e) => {
                            e.preventDefault();
                            try {
                                const res = await getProductDetailAPI(entity.productId);
                                if (res.data) {
                                    setDataViewDetail(res.data);
                                    setOpenViewDetail(true);
                                }
                            } catch (error) {
                                console.error("Lỗi khi lấy thông tin product:", error);
                            }
                        }}
                    >
                        {entity.productId}
                    </a>
                );
            },
        },

        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer", margin: "0 10px" }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdate(entity);
                            }}
                        />

                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa book"}
                            description={"Bạn có chắc chắn muốn xóa book này ?"}
                            onConfirm={() => handleDeleteProduct(entity.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                            okButtonProps={{ loading: isDeleteProduct }}
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
            <ProTable<IProductTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort) => {
                    const query = `current=${params.current}&pageSize=${params.pageSize}`;
                    const res = await getAllProductDetailsAPI(query);
                    if (res.data) {
                        setMeta(res.data.meta);
                    }

                    return {
                        data: res.data || [],
                        success: true,
                    };
                }}
                rowKey="_id"
                search={false}
                headerTitle="Chi tiết kỹ thuật sản phẩm"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />

            < DetailProduct
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            < DetailOfProduct
                openViewDetailSpecification={openViewDetailSpecification}
                setOpenViewDetailSpecification={setOpenViewDetailSpecification}
                dataViewDetailSpecification={dataViewDetailSpecification}
                setDataViewDetailSpecification={setDataViewDetailSpecification}
            />
            <CreateProductDetail
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateProductDetail
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />
        </>
    );
};

export default TableProductDetail;
