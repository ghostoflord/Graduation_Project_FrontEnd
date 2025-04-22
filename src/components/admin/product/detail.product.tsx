

import { FORMATE_DATE_VN } from "@/services/helper";
import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    openViewDetail: boolean;
    setOpenViewDetail: (v: boolean) => void;
    dataViewDetail: IProductTable | null;
    setDataViewDetail: (v: IUserTable | null) => void;

}
const DetailProduct = (props: IProps) => {
    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props;

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null);
    }

    const imageURL = `${import.meta.env.VITE_BACKEND_URL}/upload/products/${dataViewDetail?.image}`
    console.log("CHECK", imageURL)
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
                        <Avatar size={40} src={imageURL}></Avatar>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {dayjs(dataViewDetail?.createdAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At">
                        {dayjs(dataViewDetail?.updatedAt).format(FORMATE_DATE_VN)}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}
export default DetailProduct;
