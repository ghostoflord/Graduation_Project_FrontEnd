import { create } from "zustand";

export { };

declare global {

    /**
     * 
    Module Auth
     */
    interface IBackendRes<T> {
        error?: string | string[];
        message: string | string[];
        statusCode: number | string;
        data?: T;
    }

    interface IRequest {
        url: string;
        method: string;
        body?: { [key: string]: any };
        queryParams?: any;
        useCredentials?: boolean;
        headers?: any;
        nextOption?: any;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        }
    }

    interface IRegister {
        id: string;
        email: string;
        fullName: string;
    }

    interface IFetchAccount {
        user: IUser
    }

    /**
    * 
    Module User
    */
    interface IUser {
        email: string;
        phone: string;
        name: string;
        role: string;
        avatar: string;
        id: string;
    }

    interface IUserTable {
        id: string;
        name: string;
        email: string;
        address: string;
        age: string;
        phone: string;
        role: string;
        avatar: string;
        active: number;
        createdAt: Date;
        updatedAt: Date;
        gender: string;
        firstName: string;
        lastName: string;
    }

    interface IResponseImport {
        countSuccess: number;
        countError: number;
        detail: any;
    }

    interface UserAccountInfo {
        name: string;
        email: string;
        orderCount: number;
        cartSum: number;
    }

    /**
    * 
    Module Product
    */
    interface IProductTable {
        id: string;
        image: string;
        name: string;
        price: string;
        sold: number;
        quantity: string;
        detailDescription: string;
        productCode: string;
        guarantee: string;
        factory: string;
        shortDescription: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        bestsell: string;
        sell: string;
        averageRating: number;
        totalReviews: number;
    }

    export interface ProductDetail {
        id?: number;
        cpu: string;
        ram: string;
        storage: string;
        gpu: string;
        screen: string;
        battery: string;
        weight: string;
        material: string;
        os: string;
        specialFeatures: string;
        ports: string;
        productId: string;
    }


    /**
    * 
    Module Cart
    */
    interface ICart {
        quantity: number;
        price: number;
        sum: number;
        userId: number;
    }

    interface ICartItem {
        quantity: number;
        price: number;
        productId: number;
        userId: number;
    }

    interface CartItem {
        productId: number;
        name: string;
        price: number;
        quantity: number;
        image: string;
        detailDescription: string;
        shortDescription: string;
    }

    interface ICartSummary {
        quantity: number;
        price: number;
        sum: number;
        userId: number;
        items: CartItem[];
    }

    interface CartState {
        items: CartItem[];
        total: number;
        addItem: (item: CartItem) => void;
        updateItems: (items: CartItem[]) => void;
        clearCart: () => void;
    }

    /**
    * 
    Module VNPay
    */
    export interface VNPayRequestData {
        amount: totalPrice,
        paymentRef,
        userId,
        name,
        address,
        phone,
        items: itemsToCheckout,
    }

    export interface VNPayRequestData {
        userId: number;
        amount: number;
        paymentRef: string;
        paymentStatus: string;
        receiverName: string;
        receiverAddress: string;
        receiverPhone: string;
        items: {
            productId: number;
            quantity: number;
        }[];
    }

    /**
    * 
    Module Order
    */
    interface IOrderTable {
        id: number;
        receiverName: string;
        receiverPhone: string;
        receiverAddress: address,
        status: string;
        createdAt: string;
        totalPrice: number;
        totalQuantity: number; // thêm dòng này
    }

    interface IOrder {
        userId: number;
        receiverName: name,
        receiverAddress: address,
        receiverPhone: phone
    }

    export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
    export type PaymentStatus = 'PAID' | 'UNPAID';
    export type PaymentMethod = 'COD' | 'VNPAY';

    export interface UpdateOrderRequest {
        receiverName?: string;
        receiverAddress?: string;
        receiverPhone?: string;
        status?: OrderStatus;
        paymentStatus?: PaymentStatus;
        paymentMethod?: PaymentMethod;
        shippingMethod?: string;
        trackingCode?: string;
        estimatedDeliveryTime?: string;
    }

    /**
    * 
    Module Permission
    */
    interface IPermission {
        id?: string;
        name?: string;
        apiPath?: string;
        method?: string;
        module?: string;

        createdBy?: string;
        isDeleted?: boolean;
        deletedAt?: boolean | null;
        createdAt?: string;
        updatedAt?: string;

    }

    /**
    * 
    Module Role
    */
    export interface IRole {
        id?: string;
        name: string;
        description: string;
        permissions: IPermission[] | string[];

        createdBy?: string;
        isDeleted?: boolean;
        deletedAt?: boolean | null;
        createdAt?: string;
        updatedAt?: string;
    }

    /**
    * 
    Module Notifications
    */
    export interface INotification {
        id: number;
        title: string;
        content: string;
        isRead: boolean;
        createdAt: string;
        forAll: boolean;
    }

    /**
    * 
     Module Voucher
    */
    export interface IVoucher {
        id: number;
        code: string;
        description: string;
        discountValue: number;
        percentage: boolean;
        startDate: string; // ISO 8601 format
        endDate: string;
        singleUse: boolean;
        isActive: boolean;
        used: boolean;
        assignedUser?: {
            id: number;
            name: string;
            email: string;
        } | null;
        createdAt: string;
        updatedAt: string;
        assignedUser: IAssignedUser | null;
    }

    export interface IAssignedUser {
        id: number;
        name: string;
        email: string;
    }

}