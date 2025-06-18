import CreateFlashSaleModal from "@/components/admin/flashsale/create.flash.sale";
import { Button } from "antd";
import { useState } from "react";
const FlashSalePage = () => {
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const fetchFlashSales = () => {
        // TODO: Gọi API để lấy danh sách flash sale
        console.log("Fetching Flash Sales...");
    };
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2>Quản lý Flash Sale</h2>
                <Button type="primary" onClick={() => setOpenModalCreate(true)}>
                    Tạo Flash Sale
                </Button>
            </div>

            {/* Danh sách Flash Sale (bạn có thể gắn thêm component table ở đây sau) */}

            <CreateFlashSaleModal
                open={openModalCreate}
                setOpen={setOpenModalCreate}
                refreshTable={fetchFlashSales} // hoặc () => {} nếu chưa có
            />
        </div>
    );
};

export default FlashSalePage;
