import { Drawer, Descriptions, Tag } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "@/services/helper";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IVoucher | null;
    setDataViewDetail: (v: IVoucher | null) => void;
}

const DetailVoucher = ({ openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail }: IProps) => {
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    if (!dataViewDetail) return null;

    return (
        <Drawer
            title="Chi tiết voucher"
            width="50vw"
            onClose={onClose}
            open={openViewDetail}
        >
            <Descriptions
                title="Thông tin Voucher"
                bordered
                column={2}
            >
                <Descriptions.Item label="ID">{dataViewDetail.id}</Descriptions.Item>
                <Descriptions.Item label="Mã giảm giá">{dataViewDetail.code}</Descriptions.Item>
                <Descriptions.Item label="Mô tả">{dataViewDetail.description}</Descriptions.Item>
                <Descriptions.Item label="Giá trị">
                    {dataViewDetail.percentage
                        ? `${dataViewDetail.discountValue}%`
                        : `${dataViewDetail.discountValue.toLocaleString()} đ`}
                </Descriptions.Item>
                <Descriptions.Item label="Áp dụng một lần?">
                    <Tag color={dataViewDetail.singleUse ? "orange" : "blue"}>
                        {dataViewDetail.singleUse ? "Có" : "Không"}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Đã dùng?">
                    <Tag color={dataViewDetail.used ? "red" : "green"}>
                        {dataViewDetail.used ? "Đã dùng" : "Chưa dùng"}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={dataViewDetail.isActive ? "green" : "default"}>
                        {dataViewDetail.isActive ? "Đang hoạt động" : "Ngưng"}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày bắt đầu">
                    {dayjs(dataViewDetail.startDate).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày kết thúc">
                    {dayjs(dataViewDetail.endDate).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
                <Descriptions.Item label="Người được gán">
                    {dataViewDetail.assignedUser ? (
                        `${dataViewDetail.assignedUser.name} (${dataViewDetail.assignedUser.email})`
                    ) : (
                        <Tag color="gray">Chung</Tag>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Tạo lúc">
                    {dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật lúc">
                    {dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default DetailVoucher;
