export { };

declare global {
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

    interface IUser {
        email: string;
        phone: string;
        name: string;
        role: string;
        avatar: string;
        id: string;
    }

    interface IFetchAccount {
        user: IUser
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
    }

    interface ICart {
        quantity: number;
        price: number;
        sum: number;
        userId: number;
    }

    interface IHistory {
        _id: string;
        name: string;
        type: string;
        email: string;
        phone: string;
        userId: string;
        detail:
        {
            bookName: string;
            quantity: number;
            _id: string;
        }[];
        totalPrice: number;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IOrderTable extends IHistory {

    }

}