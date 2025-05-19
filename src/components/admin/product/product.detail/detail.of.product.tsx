
import { Descriptions, Drawer } from "antd";

interface IProps {
    openViewDetailSpecification: boolean;
    setOpenViewDetailSpecification: (v: boolean) => void;
    dataViewDetailSpecification: ProductDetail | null;
    setDataViewDetailSpecification: (v: ProductDetail | null) => void;
}

const DetailOfProduct = (props: IProps) => {
    const { openViewDetailSpecification, setOpenViewDetailSpecification, dataViewDetailSpecification, setDataViewDetailSpecification } = props;

    const onClose = () => {
        setOpenViewDetailSpecification(false);
        setDataViewDetailSpecification(null);
    };

    const product = dataViewDetailSpecification?.product;
    return (
        <Drawer
            title="Chức năng xem chi tiết thông số sản phẩm"
            width={"50vw"}
            onClose={onClose}
            open={openViewDetailSpecification}
        >
            <Descriptions title="Thông tin thông số của sản phẩm " bordered column={2}>
                <Descriptions.Item label="CPU">{dataViewDetailSpecification?.cpu}</Descriptions.Item>
                <Descriptions.Item label="RAM">{dataViewDetailSpecification?.ram}</Descriptions.Item>
                <Descriptions.Item label="Storage">{dataViewDetailSpecification?.storage}</Descriptions.Item>
                <Descriptions.Item label="GPU">{dataViewDetailSpecification?.gpu}</Descriptions.Item>
                <Descriptions.Item label="Màn hình">{dataViewDetailSpecification?.screen}</Descriptions.Item>
                <Descriptions.Item label="Pin">{dataViewDetailSpecification?.battery}</Descriptions.Item>
                <Descriptions.Item label="Trọng lượng">{dataViewDetailSpecification?.weight}</Descriptions.Item>
                <Descriptions.Item label="Chất liệu">{dataViewDetailSpecification?.material}</Descriptions.Item>
                <Descriptions.Item label="Hệ điều hành">{dataViewDetailSpecification?.os}</Descriptions.Item>
                <Descriptions.Item label="Tính năng">{dataViewDetailSpecification?.specialFeatures}</Descriptions.Item>
                <Descriptions.Item label="Cổng kết nối">{dataViewDetailSpecification?.ports}</Descriptions.Item>
            </Descriptions>
        </Drawer>
    );
};

export default DetailOfProduct;
