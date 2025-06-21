import { Drawer, Descriptions, List, Typography, Tag } from "antd";
import dayjs from "dayjs";
import { FORMATE_DATE_VN } from "@/services/helper";

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IFlashSale | null;
    setDataViewDetail: (v: IFlashSale | null) => void;
}

const DetailFlashSale = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    };

    return (
        <Drawer
            title="Chi tiết Flash Sale"
            width={"50vw"}
            onClose={onClose}
            open={openViewDetail}
        >
            <Descriptions
                title="Thông tin Flash Sale"
                bordered
                column={2}
            >
                <Descriptions.Item label="ID">{dataViewDetail?.id}</Descriptions.Item>
                <Descriptions.Item label="Tên">{dataViewDetail?.name}</Descriptions.Item>
                <Descriptions.Item label="Thời gian bắt đầu">
                    {dayjs(dataViewDetail?.startTime).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời gian kết thúc">
                    {dayjs(dataViewDetail?.endTime).format(FORMATE_DATE_VN)}
                </Descriptions.Item>
                <Descriptions.Item label="Số lượng sản phẩm">
                    {dataViewDetail?.items?.length ?? 0} sản phẩm
                </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
                <Typography.Title level={5}>Danh sách sản phẩm</Typography.Title>
                <List
                    bordered
                    size="small"
                    dataSource={dataViewDetail?.items || []}
                    renderItem={(item: IFlashSaleItem) => (
                        <List.Item>
                            <Typography.Text>
                                <Tag color="blue">ID SP: {item.productId}</Tag>
                                <span style={{ marginLeft: 8 }}>
                                    Giá sale: {item.salePrice.toLocaleString()}đ, Số lượng: {item.quantity}
                                </span>
                            </Typography.Text>
                        </List.Item>
                    )}
                />
            </div>
        </Drawer>
    );
};

export default DetailFlashSale;
