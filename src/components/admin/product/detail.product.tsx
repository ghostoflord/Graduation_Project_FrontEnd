import { FORMATE_DATE_VN } from "@/services/helper";
import { Avatar, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IProductTable | null;
    setDataViewDetail: (v: IProductTable | null) => void;
}

const DetailProduct = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;
    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }
    const imageURL = `${import.meta.env.VITE_BACKEND_URL}/upload/products/${dataViewDetail?.image}`

    return (
        <>
            <Drawer
                title="Chức năng xem chi tiết"
                width={"50vw"}
                onClose={onClose}
                open={openViewDetail}
            >
                <Descriptions
                    title="Thông tin product"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">{dataViewDetail?.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{dataViewDetail?.name}</Descriptions.Item>
                    <Descriptions.Item label="Product code">{dataViewDetail?.productCode}</Descriptions.Item>
                    <Descriptions.Item label="Detail Decs">{dataViewDetail?.detailDescription}</Descriptions.Item>
                    <Descriptions.Item label="Factory">{dataViewDetail?.factory}</Descriptions.Item>
                    <Descriptions.Item label="Guarantee">{dataViewDetail?.guarantee}</Descriptions.Item>
                    <Descriptions.Item label="price">{dataViewDetail?.price}</Descriptions.Item>
                    <Descriptions.Item label="Quantity">{dataViewDetail?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Sold">{dataViewDetail?.sold}</Descriptions.Item>
                    <Descriptions.Item label="short decs">{dataViewDetail?.shortDescription}</Descriptions.Item>
                    <Descriptions.Item label="Image">
                        <Avatar size={64} src={imageURL} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dataViewDetail?.createdAt ? dayjs(dataViewDetail.createdAt).format(FORMATE_DATE_VN) : "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dataViewDetail?.updatedAt ? dayjs(dataViewDetail.updatedAt).format(FORMATE_DATE_VN) : "N/A"}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
}

export default DetailProduct;
