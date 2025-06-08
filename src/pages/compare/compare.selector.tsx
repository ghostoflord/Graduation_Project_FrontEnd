import { useEffect, useState } from "react";
import { Card, Checkbox, Row, Col, Button, message, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { getAllProductDetailsAPI } from "@/services/api";

const CompareSelector = () => {
    const [products, setProducts] = useState<IProductTable[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAllProductDetailsAPI().then((res) => {
            setProducts(res.data || []);
        });
        
    }, []);

    const handleCheckboxChange = (checked: boolean, id: number) => {
        let newSelectedIds = [...selectedIds];
        if (checked) {
            if (selectedIds.length >= 2) {
                message.warning("Chỉ được chọn tối đa 2 sản phẩm để so sánh");
                return;
            }
            newSelectedIds.push(id);
        } else {
            newSelectedIds = newSelectedIds.filter((item) => item !== id);
        }
        setSelectedIds(newSelectedIds);
    };

    const handleCompare = () => {
        if (selectedIds.length !== 2) {
            message.warning("Vui lòng chọn đúng 2 sản phẩm để so sánh");
            return;
        }
        navigate(`/compare?ids=${selectedIds.join(",")}`);
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                {products.map((product) => (
                    <Col key={product.id} span={6}>
                        <Card
                            cover={<Image src={product.image} alt={product.name} height={200} preview={false} />}
                            actions={[
                                <Checkbox
                                    checked={selectedIds.includes(product.id)}
                                    onChange={(e) => handleCheckboxChange(e.target.checked, product.id)}
                                >
                                    So sánh
                                </Checkbox>,
                            ]}
                        >
                            <Card.Meta title={product.name} />
                        </Card>
                    </Col>
                ))}
            </Row>
            <div style={{ marginTop: 24, textAlign: "center" }}>
                <Button
                    type="primary"
                    disabled={selectedIds.length !== 2}
                    onClick={handleCompare}
                >
                    So sánh ngay
                </Button>
            </div>
        </div>
    );
};

export default CompareSelector;
