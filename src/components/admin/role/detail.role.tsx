import { FORMATE_DATE_VN } from "@/services/helper";
import { Descriptions, Drawer, Tag } from "antd";
import dayjs from "dayjs";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IRole | null;
    setDataViewDetail: (v: IRole | null) => void;
}

const DetailRole = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    return (
        <Drawer
            title="Chi tiết vai trò"
            width={"50vw"}
            onClose={onClose}
            open={openViewDetail}
        >
            <Descriptions
                title="Thông tin vai trò"
                bordered
                column={2}
            >
                <Descriptions.Item label="ID">{dataViewDetail?.id}</Descriptions.Item>
                <Descriptions.Item label="Tên vai trò">{dataViewDetail?.name}</Descriptions.Item>
                <Descriptions.Item label="Mô tả" span={2}>{dataViewDetail?.description}</Descriptions.Item>
                <Descriptions.Item label="Danh sách quyền" span={2}>
                    {(dataViewDetail?.permissions || []).map((p: any) => (
                        <Tag color="blue" key={typeof p === "string" ? p : p.id}>
                            {typeof p === "string" ? p : p.name}
                        </Tag>
                    ))}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                    {dataViewDetail?.createdAt
                        ? dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN)
                        : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                    {dataViewDetail?.updatedAt
                        ? dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE_VN)
                        : "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Tạo bởi">
                    {dataViewDetail?.createdBy || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Đã xóa">
                    {dataViewDetail?.isDeleted ? "Có" : "Không"}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default DetailRole;
