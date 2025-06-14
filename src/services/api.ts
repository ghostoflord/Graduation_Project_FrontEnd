import axios from 'services/axios.customize';
import queryString from 'query-string';
import { create } from 'zustand';
// thay axios bằng instance
/**
 * 
Module Auth
 */
export const loginAPI = (username: string, password: string) => {
    const urlBackend = "/api/v1/auth/login";
    return axios.post<IBackendRes<ILogin>>(urlBackend, { username, password }, {
        headers: {
            delay: 1000
        }
    })
}

export const fetchAccountAPI = () => {
    const urlBackend = "/api/v1/auth/account";
    return axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
        headers: {
            delay: 100
        }
    })
}

export const logoutAPI = () => {
    const urlBackend = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>>(urlBackend)
}

export const registerAPI = (name: string, email: string, password: string, address: string, age: string) => {
    const urlBackend = "/api/v1/auth/register";
    return axios.post<IBackendRes<IRegister>>(urlBackend,
        { name, email, password, address, age },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        });
};

export const sendRequest = async <T>(props: IRequest) => {
    let { url, method, body, queryParams = {}, useCredentials = false, headers = {}, nextOption = {} } = props;
    const options: any = {
        method: method,
        headers: new Headers({ 'content-type': 'application/json', ...headers }),
        body: body ? JSON.stringify(body) : null,
        ...nextOption
    };
    if (useCredentials) options.credentials = "include";

    if (queryParams) {
        url = `${url}?${queryString.stringify(queryParams)}`;
    }

    return fetch(url, options).then(res => {
        if (res.ok) {
            return res.json() as T; //generic
        } else {
            return res.json().then(function (json) {
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};

export const resendVerificationAPI = (email: string) => {
    const urlBackend = "/api/v1/auth/resend-verification";
    return axios.post<IBackendRes<any>>(urlBackend, { email });
};

/**
 * 
Module User
 */
export const updateUserAPI = (id: string, firstName: string, lastName: string, name: string, address: string, gender: string, age: string, roleId: string, avatar?: string
) => {
    const urlBackend = "/api/v1/users/update";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { id, firstName, lastName, name, address, gender, age, avatar, roleId });
};

export const getUsersAPI = (query: string) => {
    const urlBackend = `/api/v1/users?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}

export const createUserAPI = (name: string, email: string, password: string, gender: string, avatar: string, address: string, age: string) => {
    return axios.post("/api/v1/users", { name, email, password, gender, avatar, address, age });
};

export const deleteUserAPI = (id: string) => {
    const urlBackend = `/api/v1/users/${id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const getAccountInfoAPI = () => {
    const urlBackend = "/api/v1/users/account/info";
    return axios.get<IBackendRes<UserAccountInfo>>(urlBackend);
};

export const importUserExcelAPI = (data: any[]) => {
    return axios.post("/api/v1/users/import", data);
};

//
export const getUserByIdAPI = (id: number) => {
    const url = `/api/v1/users/me/${id}`;
    return axios.get<IBackendRes<IUserTable>>(url);
};

export const selfUpdateUserAPI = (data: IUserTable) => {
    return axios.post<IBackendRes<IUserTable>>("/api/v1/users/me/update", data);
};

/**
 * 
Module Upload File
 */
export const uploadFileAPI = (file: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folder);
    return axios<IBackendRes<{
        fileName: string
    }>>({
        method: 'post', url: '/api/v1/files', data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}


/**
 * 
Module Product
 */
export const getProductsAPI = (query: string) => {
    const urlBackend = `/api/v1/products?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IProductTable>>>(urlBackend)
}

export const getProductDetailAPI = (id: string) => {
    const urlBackend = `/api/v1/products/${id}`;
    return axios.get<IBackendRes<IProductTable>>(urlBackend);
};

export const getProductDetailSlugAPI = (slug: string) => {
    const urlBackend = `/api/v1/products/slug/${slug}`;
    return axios.get<IBackendRes<IProductTable>>(urlBackend);
};

export const createProductAPI = (name: string, productCode: string, detailDescription: string, guarantee: string, image: string, factory: string, price: string, sold: string, quantity: string, shortDescription: string, bestsell: string, sell: string) => {
    return axios.post("/api/v1/products", { name, productCode, detailDescription, guarantee, image, factory, price, sold, quantity, shortDescription, bestsell, sell });
};

export const updateProductAPI = (id: string, name: string, productCode: string, detailDescription: string, guarantee: string, factory: string, price: string, sold: string, quantity: string, shortDescription: string, bestsell: string, sell: string, image?: string) => {
    const urlBackend = "/api/v1/products/update";
    return axios.put<IBackendRes<IRegister>>(urlBackend, { id, name, productCode, detailDescription, guarantee, factory, price, sold, quantity, shortDescription, bestsell, sell, image });
};

export const deleteProductAPI = (id: string) => {
    const urlBackend = `/api/v1/products/${id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

/**
 * 
Module Product Detail
 */
export const getAllProductDetailsAPI = () => {
    return axios.get<IBackendRes<ProductDetail[]>>("/api/v1/product-details");
};

export const getProductDetailByIdAPI = (id: string) => {
    return axios.get<IBackendRes<ProductDetail>>(`/api/v1/product-details/${id}`);
};

export const getProductDetailByProductIdAPI = (productId: string) => {
    return axios.get<IBackendRes<ProductDetail>>(`/api/v1/product-details/by-product/${productId}`);
};

export const createProductDetailAPI = (data: ProductDetail) => {
    return axios.post<IBackendRes<ProductDetail>>("/api/v1/product-details", data);
};

export const updateProductDetailAPI = (id: string, data: ProductDetail) => {
    return axios.put<IBackendRes<ProductDetail>>(`/api/v1/product-details/${id}`, data);
};

export const deleteProductDetailAPI = (id: string) => {
    return axios.delete<IBackendRes<any>>(`/api/v1/product-details/${id}`);
};

/**
 * 
Module Cart
 */
export const getCart = (userId: string) => {
    const urlBackend = `/api/v1/carts/users/${userId}`;
    return axios.get<IBackendRes<ICartSummary>>(urlBackend);
};

export const addToCartAPI = (data: { quantity: number; price: number; productId: number; userId: number; }) => {
    return axios.post('/api/v1/carts/addproduct', data);
};

export const useCartStore = create<CartState>((set) => ({
    items: [],
    total: 0,
    addItem: (item) =>
        set((state) => {
            const existing = state.items.find(i => i.productId === item.productId);
            let newItems;

            if (existing) {
                newItems = state.items.map(i =>
                    i.productId === item.productId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            } else {
                newItems = [...state.items, item];
            }

            const newTotal = newItems.reduce((sum, i) => sum + i.quantity, 0);

            return { items: newItems, total: newTotal };
        }),

    updateItems: (items) => set({ items, total: items.reduce((sum, i) => sum + i.quantity, 0), }),
    clearCart: () => set({ items: [], total: 0 }),
}));

export const removeCartItemAPI = (userId: number, productId: number) => {
    const urlBackend = "/api/v1/carts/remove";
    return axios.delete<IBackendRes<any>>(urlBackend, {
        params: { userId, productId }
    });
};

export const clearCartAPI = (userId: number) => {
    const urlBackend = `/api/v1/carts/${userId}/clears`;
    return axios.delete<IBackendRes<any>>(urlBackend);
};

/**
 * 
Module Notifications
 */
export const createNotificationAPI = (
    title: string,
    content: string,
    userId?: number
) => {
    const urlBackend = `/api/v1/notifications/create`;

    const params: Record<string, any> = { title, content };
    if (userId !== undefined) {
        params.userId = userId;
    }

    return axios.post<IBackendRes<any>>(urlBackend, null, {
        params,
    });
};

export const getNotificationsAPI = async (
    params: { userId: number; current?: number; pageSize?: number }
) => {
    const { userId, current = 1, pageSize = 5 } = params;

    const queryParams = new URLSearchParams({
        userId: userId.toString(),
        page: current.toString(),
        pageSize: pageSize.toString(),
    });
    return await axios.get(`/api/v1/notifications/user?${queryParams.toString()}`);
};

export const callFetchNotifications = async (query: string) => {
    return await axios.get(`/api/v1/notifications?${query}`);
};

export const markNotificationAsReadAPI = (notificationId: number) => {
    const urlBackend = `/api/v1/notifications/${notificationId}/read`;
    return axios.post<IBackendRes<any>>(urlBackend);
};

/**
 * 
Module Order
 */
export const placeOrderAPI = (data: { userId: number; name: string, address: string, phone: string, }) => {
    return axios.post('/api/v1/orders/place', data);
};

export const fetchOrderSummaryById = async (id: string): Promise<IOrderTable> => {
    const response = await axios.get<IOrderTable>(`/api/v1/orders/${id}`);
    return response.data;
};

export const fetchAllOrders = async (): Promise<IOrderTable[]> => {
    const response = await axios.get<IOrderTable[]>('/api/v1/orders/all');
    return response.data;
};

export const fetchMyOrders = async (): Promise<IOrderTable[]> => {
    const response = await axios.get('/api/v1/orders/my-orders');
    return response.data;
};

export const fetchOrderDetails = async (orderId: number) => {
    const res = await axios.get(`/api/v1/orders/${orderId}/details`);
    return res.data;
};

// Gọi API checkout để trừ quantity
export const checkoutOrder = async (items: { productId: number; quantity: number }[]) => {
    const res = await axios.post('/api/v1/orders/checkout', items);
    return res.data;
};

export const updateOrderAPI = async (orderId: number, data: UpdateOrderRequest) => {
    const response = await axios.post(`/api/v1/orders/${orderId}/update`, data);
    return response;
};

export const deleteOrderAPI = async (orderId: string) => {
    const res = await axios.delete(`/api/v1/orders/${orderId}`);
    return res;
};

// Lấy danh sách đơn hàng dành cho shipper
export const getOrdersForShipperAPI = (query: string) => {
    return axios.get(`/api/v1/orders/shipper?${query}`);
};

// Shipper nhận đơn hàng
export const acceptOrderAPI = (orderId: number) => {
    return axios.post(`/api/v1/orders/${orderId}/accept`);
};

// Shipper hoàn thành đơn hàng
export const completeOrderAPI = (orderId: number) => {
    return axios.post(`/api/v1/orders/${orderId}/complete`);
};

export const markOrderAsDeliveredAPI = (orderId: number) => {
    return axios.put(`/api/v1/orders/${orderId}/delivered`);
};

export const getDeliveredOrders = () => {
    return axios.get(`/api/v1/orders/shipper/delivered`);
};

// Nếu backend không cần from, to nữa:
export const getShipperStats = (shipperId: number) => {
    return axios.get('/api/v1/orders/shipper-stats', {
        params: { shipperId },
    });
};


/**
 * 
Module Dashboard
 */
export const getDashboardAPI = () => {
    return axios.get<IBackendRes<{ countOrder: number; countUser: number; countProduct: number; totalRevenue: number; totalCanceledQuantity: number; }>>("/api/v1/dashboard");
};

/**
 * 
Module VNPay
 */
export const createVNPayURL = (data: VNPayRequestData) => {
    return axios.post('/api/v1/payment/vnpay', data);
};

/**
 * 
Module Comment
 */
export const getCommentsByProductAPI = (productId: number) => {
    return axios.get(`/api/v1/comments/product/${productId}`);
};

export const postCommentAPI = (comment: { userId: number; productId: number; content: string; }) => {
    return axios.post(`/api/v1/comments`, comment);
};

/**
 * 
Module Like
 */
export const toggleLikeAPI = (productId: number, userId: number) => {
    return axios.post('/api/v1/likes/toggle', null, { params: { productId, userId } });
};

export const getLikedProductsAPI = (userId: number): Promise<ILike[]> => {
    return axios.get(`/api/v1/likes/user/${userId}`);
};

/**
 * 
Module Review
 */
export const addOrUpdateReviewAPI = (productId: number, userId: number, rating: number) => {
    return axios.post('/api/v1/reviews', { productId, userId, rating });
};

/**
 * Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>("/api/v1/permissions", permission);
};

export const callUpdatePermission = (permission: IPermission) => {
    return axios.put<IBackendRes<IPermission>>("/api/v1/permissions", permission);
};

export const callDeletePermission = (id: number | string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
};

export const callFetchPermissions = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
};

/**
 *Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', role);
};

export const callUpdateRole = (role: IRole) => {
    return axios.put<IBackendRes<IRole>>('/api/v1/roles', role);
};

export const callDeleteRole = (id: number | string) => {
    return axios.delete<IBackendRes<void>>(`/api/v1/roles/${id}`);
};

export const callFetchRoles = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
};

export const callGetRoleById = (id: number | string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
};

/**
 *Module Chat
 */
export const sendMessageToChatbot = async (prompt: string): Promise<string> => {
    return await axios.post('/api/v1/chat', { prompt });
};

export const sendMessageToChatBOT = (message: string) => {
    return axios.post<string>('/api/v1/manual-chat', { message });
};

/**
* 
 Module Voucher
*/
export const createVoucherAPI = (voucher: {
    code: string;
    description: string;
    discountValue: number;
    isPercentage: boolean;
    startDate: string;
    endDate: string;
    isSingleUse: boolean;
}) => {
    return axios.post<IBackendRes<IVoucher>>("/api/v1/vouchers", voucher);
};

// Gán voucher cho user
export const assignVoucherToUserAPI = (voucherId: number, userId: number) => {
    return axios.post<IBackendRes<string>>(`/api/v1/vouchers/assign`, null, {
        params: {
            voucherId,
            userId,
        },
    });
};

// Áp dụng voucher
export const applyVoucherAPI = (userId: string, code: string, orderTotal: string) => {
    return axios.post<IBackendRes<number>>(`/api/v1/vouchers/apply`, null, {
        params: {

            userId,
            code,
            orderTotal,
        },
    });
};

export const getAllVouchersAPI = () => {
    return axios.get<IBackendRes<IVoucher[]>>("/api/v1/vouchers");
};

export const deleteVoucherAPI = (id: number) => {
    return axios.delete<IBackendRes<string>>(`/api/v1/vouchers/${id}`);
};

export const getVouchersForUserAPI = (userId: number) => {
    return axios.get<IBackendRes<IVoucher[]>>(`/api/v1/vouchers/user/${userId}`);
};

export const compareProductsAPI = (ids: number[]) => {
    const query = ids.join(",");
    return axios.get<IBackendRes<CompareProductDTO[]>>(`/api/v1/compare?ids=${query}`);
};

export const getLowStockProductsAPI = async (
    threshold: number = 5
): Promise<IBackendRes<IProductTable[]>> => {
    return axios.get(`/api/v1/products/low-stock?threshold=${threshold}`);
};