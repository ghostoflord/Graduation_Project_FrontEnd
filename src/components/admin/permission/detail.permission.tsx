import { Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "@/services/helper";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IPermission | null;
    setDataViewDetail: (v: IPermission | null) => void;
}

const DetailPermission = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    return (
        <Drawer
            title="Chi tiết permission"
            width="50vw"
            onClose={onClose}
            open={openViewDetail}
        >
            <Descriptions title="Thông tin permission" bordered column={2}>
                <Descriptions.Item label="ID">{dataViewDetail?.id}</Descriptions.Item>
                <Descriptions.Item label="Tên permission">{dataViewDetail?.name}</Descriptions.Item>
                <Descriptions.Item label="API Path">{dataViewDetail?.apiPath}</Descriptions.Item>
                <Descriptions.Item label="HTTP Method">{dataViewDetail?.method}</Descriptions.Item>
                <Descriptions.Item label="Module">{dataViewDetail?.module}</Descriptions.Item>
                <Descriptions.Item label="Người tạo">{dataViewDetail?.createdBy || "Không rõ"}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Badge
                        status={dataViewDetail?.isDeleted ? "error" : "processing"}
                        text={dataViewDetail?.isDeleted ? "Đã xóa" : "Hoạt động"}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                    {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                    {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default DetailPermission;
