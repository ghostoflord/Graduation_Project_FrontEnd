
import { useRef, useState } from 'react';
import { Popconfirm, Button, App } from 'antd';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, FileImageTwoTone, PlusOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { deleteProductAPI, getProductsAPI } from '@/services/api';
import CreateProduct from './create.product';
import UpdateProduct from './update.product';
import DetailProduct from './detail.product';
import LowStockModal from './low.stock';
import UpdateImages from './update.images';
type TSearch = {
    name: string;
    productCode: string;
    createdAt: string;
    updatedAt: string;
}
const TableProduct = () => {

    const actionRef = useRef<ActionType>();
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    });

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IProductTable | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [currentDataTable, setCurrentDataTable] = useState<IProductTable[]>([]);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IProductTable | null>(null);

    const [isDeleteProduct, setIsDeleteProduct] = useState<boolean>(false);
    const { message, notification } = App.useApp();

    const [openUpdateImages, setOpenUpdateImages] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const [openLowStockModal, setOpenLowStockModal] = useState(false);
    const handleDeleteProduct = async (id: string) => {
        setIsDeleteProduct(true)
        try {
            const res = await deleteProductAPI(id);
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

    const columns: ProColumns<IProductTable>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            hideInSearch: true,
            render(dom, entity, index, action, schema) {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(entity);
                        setOpenViewDetail(true);
                    }}>{entity.id}</a>
                )
            },
        },
        {
            title: 'Tên Sản Phẩm',
            dataIndex: 'name',
            sorter: true
        },
        {
            title: 'Miêu Tả',
            dataIndex: 'detailDescription',
            hideInSearch: true,
        },
        {
            title: 'Mã Sản Phẩm',
            dataIndex: 'productCode',
            sorter: true,
        },
        {
            title: 'Giá Tiền',
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
        {
            title: 'Image',
            dataIndex: 'image',
            render: (_, entity) => {
                const avatarUrl = entity.image?.startsWith('http')
                    ? entity.image
                    : `${import.meta.env.VITE_BACKEND_URL}/upload/products/${entity.image}`;
                return avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Product Avatar"
                        style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : (
                    <span>No product</span>
                );
            },
        },

        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            valueType: 'date',
            hideInSearch: true
        },

        {
            title: 'Action',
            hideInSearch: true,
            width: 100,
            render(dom, entity, index, action, schema) {
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                ></div>
                return (
                    <>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <EditTwoTone
                                twoToneColor="#f57800"
                                style={{ cursor: "pointer" }}
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
                            <FileImageTwoTone
                                twoToneColor="#1890ff"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    setSelectedProductId(entity.id);
                                    setOpenUpdateImages(true);
                                }}
                            />
                        </div>

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
                request={async (params) => {
                    let query = `current=${params.current}&pageSize=${params.pageSize}`;

                    const filters: string[] = [];

                    if (params.name) {
                        filters.push(`name~'${params.name}'`);
                    }

                    if (params.productCode) {
                        filters.push(`productCode~'${params.productCode}'`);
                    }

                    if (filters.length > 0) {
                        query += `&filter=${filters.join(" and ")}`;
                    }

                    const res = await getProductsAPI(query);

                    if (res.data) {
                        setMeta(res.data.meta);
                        setCurrentDataTable(res.data?.result ?? []);
                    }

                    return {
                        data: res.data?.result,
                        page: params.current,
                        success: true,
                        total: res.data?.meta.total,
                    };
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

                    <Button type="primary" onClick={() => setOpenLowStockModal(true)}>
                        Xem sản phẩm sắp hết hàng
                    </Button>,
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
                    </CSVLink >,
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

            <CreateProduct
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateProduct
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
            />

            < DetailProduct
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <LowStockModal
                open={openLowStockModal}
                onClose={() => setOpenLowStockModal(false)}
            />

            <UpdateImages
                open={openUpdateImages}
                onClose={() => setOpenUpdateImages(false)}
                productId={selectedProductId}
                refreshTable={refreshTable}
            />
        </>
    )
}
export default TableProduct;