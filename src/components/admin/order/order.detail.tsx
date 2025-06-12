import { Drawer, Descriptions, Badge } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "@/services/helper";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IOrderTable | null;
    setDataViewDetail: (v: IOrderTable | null) => void;
}

const DetailOrder = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    return (
        <Drawer
            title="Chi tiết đơn hàng"
            width="50vw"
            onClose={onClose}
            open={openViewDetail}
        >
            <Descriptions title="Thông tin đơn hàng" bordered column={2}>
                <Descriptions.Item label="ID">{dataViewDetail?.id}</Descriptions.Item>
                <Descriptions.Item label="Người nhận">{dataViewDetail?.receiverName}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">{dataViewDetail?.receiverAddress}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{dataViewDetail?.receiverPhone}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái đơn hàng">
                    <Badge status="processing" text={dataViewDetail?.status} />
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái thanh toán">
                    <Badge
                        status={dataViewDetail?.paymentStatus === 'PAID' ? 'success' : 'warning'}
                        text={dataViewDetail?.paymentStatus || 'Không có'}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                    {dataViewDetail?.paymentMethod || 'Không có'}
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức giao hàng">
                    {dataViewDetail?.shippingMethod || 'Không có'}
                </Descriptions.Item>
                <Descriptions.Item label="Mã vận đơn">
                    {dataViewDetail?.trackingCode || 'Không có'}
                </Descriptions.Item>
                <Descriptions.Item label="Dự kiến giao hàng">
                    {dataViewDetail?.estimatedDeliveryTime
                        ? dayjs(dataViewDetail.estimatedDeliveryTime).format(FORMATE_DATE_VN)
                        : 'Chưa có'}
                </Descriptions.Item>    
                <Descriptions.Item label="Ngày tạo">
                    {dataViewDetail?.createdAt
                        ? dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN)
                        : 'Không có'}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                    {dataViewDetail?.updatedAt
                        ? dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE_VN)
                        : 'Không có'}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default DetailOrder;
