export interface ICustomer {
    _id?: string;
    name: string;
    email: string;
    password: string;
    active?: boolean;
    disabled?: boolean;
    deleted?: boolean;
    isDeleted?: boolean;
    profilePictures?: string[];
    pointsWallet?: string[];
    visitHistory?: string[];
    favoriteRestaurants?: string[];
    badges?: string[];
    reviews?: string[];
}
