import { useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { getAllProductDetailsAPI, getProductDetailAPI } from '@/services/api';
import DetailProduct from '../detail.product';
import DetailOfProduct from './detail.of.product';
import { Button } from 'antd';
import { DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined } from '@ant-design/icons';
import CreateProductDetail from './create.product.detail';
const TableProductDetail = () => {
    const actionRef = useRef<ActionType>();

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IProductTable | null>(null);

    const [openViewDetailSpecification, setOpenViewDetailSpecification] = useState<boolean>(false);
    const [dataViewDetailSpecification, setDataViewDetailSpecification] = useState<ProductDetail | null>(null);

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });


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
                        // total: res.data?.meta.total,
                    };
                }}
                rowKey="_id"
                // pagination={{
                //     current: meta.current,
                //     pageSize: meta.pageSize,
                //     total: meta.total,
                //     showSizeChanger: true,
                //     showTotal: (total, range) =>
                //         `${range[0]}-${range[1]} trên tổng ${total} sản phẩm`,
                // }}
                search={false}
                headerTitle="Chi tiết kỹ thuật sản phẩm"
                toolBarRender={() => [
                    // <CSVLink
                    //     data={currentDataTable}
                    //     filename='export-book.csv'
                    // >
                    //     <Button
                    //         icon={<ExportOutlined />}
                    //         type="primary"
                    //     >
                    //         Export
                    //     </Button>
                    // </CSVLink >
                    // ,

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
        </>
    );
};

export default TableProductDetail;
