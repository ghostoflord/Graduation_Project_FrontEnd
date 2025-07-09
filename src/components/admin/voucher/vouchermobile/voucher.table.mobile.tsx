import { useEffect, useRef, useState } from 'react';
import {
    Card,
    Tag,
    Spin,
    Row,
    Col,
    Typography,
    Pagination,
    App,
    Button,
    Popconfirm,
    Space,
    notification
} from 'antd';
import {
    EditTwoTone,
    DeleteTwoTone,
    PlusOutlined
} from '@ant-design/icons';
import { getAllVouchersAPI, deleteVoucherAPI } from '@/services/api';
import CreateVoucher from '../voucher.create';
import AssignVoucherToUser from '../assign.voucher.to.user';
import ApplyVoucherModal from '../apply.voucher.form';
import DetailVoucher from '../detail.voucher';
import UpdateVoucher from '../update.voucher';
import { ActionType } from '@ant-design/pro-components';

interface IVoucher {
    id: number;
    code: string;
    description: string;
    discountValue: number;
    percentage: boolean;
    isSingleUse: boolean;
    used: boolean;
    isActive: boolean;
    startDate: string;
    endDate: string;
    assignedUser?: {
        name: string;
        email: string;
    };
}

const TableVoucherMobile = () => {
    const [loading, setLoading] = useState(true);
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const { message } = App.useApp();

    const actionRef = useRef<ActionType>();

    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [dataViewDetail, setDataViewDetail] = useState<IVoucher | null>(null);

    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IVoucher | null>(null);
    const [userList, setUserList] = useState<IUser[]>([]);

    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const [openModalAssign, setOpenModalAssign] = useState(false);
    const [openModalApply, setOpenModalApply] = useState(false);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await getAllVouchersAPI();
            if (res.data) {
                setVouchers(res.data.result);
            }
        } catch (error) {
            message.error('Không thể tải danh sách voucher');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVoucher = async (id: number) => {
        setIsDeleteLoading(true);
        try {
            const res = await deleteVoucherAPI(id);
            if (res && res.statusCode === 200) {
                message.success(res.message || 'Xoá voucher thành công');
                fetchVouchers();
            } else {
                notification.error({
                    message: res.error || 'Lỗi xoá voucher',
                    description: res.message || 'Không thể xoá voucher'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi hệ thống',
                description: 'Đã có lỗi xảy ra khi xoá voucher'
            });
        } finally {
            setIsDeleteLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const paginatedData = vouchers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const refreshTable = () => {
        fetchVouchers();
    };

    return (
        <>
            <div style={{ padding: 12 }}>
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    onClick={() => setOpenModalCreate(true)}
                    block
                    style={{ marginBottom: 12 }}
                >
                    Add New Voucher
                </Button>

                {loading ? (
                    <Spin tip="Loading..." />
                ) : (
                    <>
                        <Row gutter={[12, 12]}>
                            {paginatedData.map((voucher) => (
                                <Col xs={24} key={voucher.id}>
                                    <Card
                                        title={voucher.code}
                                        size="small"
                                        extra={
                                            <Space>
                                                <EditTwoTone
                                                    twoToneColor="#f57800"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setDataUpdate(voucher);
                                                        setOpenModalUpdate(true);
                                                    }}
                                                />
                                                <Popconfirm
                                                    placement="leftTop"
                                                    title="Xác nhận xóa voucher"
                                                    description="Bạn có chắc chắn muốn xóa voucher này?"
                                                    onConfirm={() => handleDeleteVoucher(voucher.id)}
                                                    okText="Xác nhận"
                                                    cancelText="Hủy"
                                                    okButtonProps={{ loading: isDeleteLoading }}
                                                >
                                                    <DeleteTwoTone
                                                        twoToneColor="#ff4d4f"
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </Popconfirm>
                                            </Space>
                                        }
                                    >
                                        <Typography.Text>{voucher.description}</Typography.Text>
                                        <div>
                                            <strong>Giá trị: </strong>
                                            {voucher.percentage
                                                ? `${voucher.discountValue}%`
                                                : `${voucher.discountValue.toLocaleString()}đ`}
                                        </div>
                                        <div>
                                            <strong>Sử dụng một lần:</strong>{' '}
                                            <Tag color={voucher.isSingleUse ? 'orange' : 'blue'}>
                                                {voucher.isSingleUse ? 'Có' : 'Không'}
                                            </Tag>
                                        </div>
                                        <div>
                                            <strong>Trạng thái:</strong>{' '}
                                            <Tag color={voucher.isActive ? 'green' : 'gray'}>
                                                {voucher.isActive ? 'Hoạt động' : 'Ngưng'}
                                            </Tag>
                                        </div>
                                        <div>
                                            <strong>Đã dùng:</strong>{' '}
                                            <Tag color={voucher.used ? 'red' : 'green'}>
                                                {voucher.used ? 'Đã dùng' : 'Chưa dùng'}
                                            </Tag>
                                        </div>
                                        <div>
                                            <strong>Hiệu lực:</strong> {voucher.startDate} → {voucher.endDate}
                                        </div>
                                        <div>
                                            <strong>Người dùng:</strong>{' '}
                                            {voucher.assignedUser ? (
                                                `${voucher.assignedUser.name} (${voucher.assignedUser.email})`
                                            ) : (
                                                <Tag color="gray">Dùng chung</Tag>
                                            )}
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={vouchers.length}
                                onChange={(page) => setCurrentPage(page)}
                                size="small"
                                simple={window.innerWidth < 1000}
                            />
                        </div>
                    </>
                )}
            </div>

            <CreateVoucher
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />
            <AssignVoucherToUser
                openModalAssign={openModalAssign}
                setOpenModalAssign={setOpenModalAssign}
                refreshTable={refreshTable}
            />
            <ApplyVoucherModal
                openModalApply={openModalApply}
                setOpenModalApply={setOpenModalApply}
            />
            <DetailVoucher
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <UpdateVoucher
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
                userList={userList || []}
            />
        </>
    );
};

export default TableVoucherMobile;
