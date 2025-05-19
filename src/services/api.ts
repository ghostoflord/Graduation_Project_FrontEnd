import axios from 'services/axios.customize';
import queryString from 'query-string';
import { create } from 'zustand';


//auth
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
    return axios.post<IBackendRes<IRegister>>(urlBackend, { name, email, password, address, age })
}

export const sendRequest = async <T>(props: IRequest) => { //type
    let {
        url,
        method,
        body,
        queryParams = {},
        useCredentials = false,
        headers = {},
        nextOption = {}
    } = props;

    const options: any = {
        method: method,
        // by default setting the content-type to be json type
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
                // to be able to access error status when you catch the error 
                return {
                    statusCode: res.status,
                    message: json?.message ?? "",
                    error: json?.error ?? ""
                } as T;
            });
        }
    });
};

//user

export const updateUserAPI = (id: string, firstName: string, lastName: string, name: string, address: string, gender: string, age: string, avatar?: string // base64
) => {
    const urlBackend = "/api/v1/users/update";
    return axios.post<IBackendRes<IRegister>>(urlBackend, { id, firstName, lastName, name, address, gender, age, avatar });
};

export const getUsersAPI = (query: string) => {
    const urlBackend = `/api/v1/users?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackend)
}

export const createUserAPI = (name: string, email: string, password: string, gender: string, avatar: string, address: string, age: string) => {
    return axios.post("/api/v1/users", { name, email, password, gender, avatar, address, age });
};

// export const updateUserAPI = (id: string, firstName: string, lastName: string, name: string, address: string, gender: string, age: string) => {
//     const urlBackend = "/api/v1/users";
//     return axios.put<IBackendRes<IRegister>>(urlBackend,
//         { id, firstName, lastName, name, address, gender, age })
// }

export const deleteUserAPI = (id: string) => {
    const urlBackend = `/api/v1/users/${id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

export const getAccountInfoAPI = () => {
    const urlBackend = "/api/v1/users/account/info";
    return axios.get<IBackendRes<UserAccountInfo>>(urlBackend);
};

export const uploadFileAPI = (file: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folder);
    return axios<IBackendRes<{
        fileName: string
    }>>({
        method: 'post',
        url: '/api/v1/files',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export const resendVerificationAPI = (email: string) => {
    const urlBackend = "/api/v1/auth/resend-verification";
    return axios.post<IBackendRes<any>>(urlBackend, { email });
};

//product
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

export const updateProductAPI = (
    id: string,
    name: string,
    productCode: string,
    detailDescription: string,
    guarantee: string,
    factory: string,
    price: string,
    sold: string,
    quantity: string,
    shortDescription: string,
    bestsell: string,
    sell: string,
    image?: string // thêm ảnh base64
) => {
    const urlBackend = "/api/v1/products/update"; // sửa lại đúng endpoint
    return axios.put<IBackendRes<IRegister>>(urlBackend, {
        id, name, productCode, detailDescription, guarantee, factory, price, sold, quantity, shortDescription, bestsell, sell, image
    });
};


export const deleteProductAPI = (id: string) => {
    const urlBackend = `/api/v1/products/${id}`;
    return axios.delete<IBackendRes<IRegister>>(urlBackend)
}

// product detail

export const getAllProductDetailsAPI = () => {
    return axios.get<IBackendRes<ProductDetail[]>>("/api/v1/product-details");
};

export const getProductDetailByIdAPI = (id: number) => {
    return axios.get<IBackendRes<ProductDetail>>(`/api/v1/product-details/${id}`);
};

export const getProductDetailByProductIdAPI = (productId: number) => {
    return axios.get<IBackendRes<ProductDetail>>(`/api/v1/product-details/by-product/${productId}`);
};

export const createProductDetailAPI = (data: ProductDetail) => {
    return axios.post<IBackendRes<ProductDetail>>("/api/v1/product-details", data);
};

export const updateProductDetailAPI = (id: number, data: ProductDetail) => {
    return axios.put<IBackendRes<ProductDetail>>(`/api/v1/product-details/${id}`, data);
};

export const deleteProductDetailAPI = (id: number) => {
    return axios.delete<IBackendRes<any>>(`/api/v1/product-details/${id}`);
};


//cart
export const getCart = (userId: string) => {
    const urlBackend = `/api/v1/carts/users/${userId}`;
    return axios.get<IBackendRes<ICartSummary>>(urlBackend);
};

export const addToCartAPI = (data: {
    quantity: number;
    price: number;
    productId: number;
    userId: number;
}) => {
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

    updateItems: (items) => set({
        items,
        total: items.reduce((sum, i) => sum + i.quantity, 0),
    }),

    clearCart: () => set({ items: [], total: 0 }),
}));

export const removeCartItemAPI = (userId: number, productId: number) => {
    const urlBackend = "/api/v1/carts/remove";
    return axios.delete<IBackendRes<any>>(urlBackend, {
        params: {
            userId,
            productId
        }
    });
};

export const clearCartAPI = (userId: number) => {
    const urlBackend = `/api/v1/carts/${userId}/clears`;
    return axios.delete<IBackendRes<any>>(urlBackend);
};

// order
export const placeOrderAPI = (data: {
    userId: number;
    name: string,
    address: string,
    phone: string,
}) => {
    return axios.post('/api/v1/orders/place', data);
};

export const fetchAllOrders = async (): Promise<IOrderTable[]> => {
    const response = await axios.get<IOrderTable[]>('/api/v1/orders/all');
    return response.data;
};

export const fetchMyOrders = async (): Promise<IOrderTable[]> => {
    const response = await axios.get('/api/v1/orders/my-orders');
    return response.data; // assuming RestResponse<T>
};

export const fetchOrderDetails = async (orderId: number) => {
    const res = await axios.get(`/api/v1/orders/${orderId}/details`);
    return res.data; // nếu backend trả về trong { data: ... }
};

// Gọi API checkout để trừ quantity
export const checkoutOrder = async (items: { productId: number; quantity: number }[]) => {
    const res = await axios.post('/api/v1/orders/checkout', items);
    return res.data; // nếu backend trả về { message: "Checkout successful" }
};
//dashboard
export const getDashboardAPI = () => {
    return axios.get<IBackendRes<{
        countOrder: number;
        countUser: number;
        countProduct: number;
        totalRevenue: number;
        totalCanceledQuantity: number;
    }>>("/api/v1/dashboard");
};

// export const addToCartAPI = (data: {
//     quantity: number;
//     price: number;
//     productId: number;
//     userId: number;
// }) => {
//     return axios.post('http://localhost:8080/api/v1/carts/add-product', data, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
// };

// import excel user
export const importUserExcelAPI = (data: any[]) => {
    return axios.post("/api/v1/users/import", data);
};

/// vnpay
export const createVNPayURL = (data: VNPayRequestData) => {
    return axios.post('/api/v1/payment/vnpay', data);
};

