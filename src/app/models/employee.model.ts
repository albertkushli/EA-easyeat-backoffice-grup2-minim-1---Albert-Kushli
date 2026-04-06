export interface IEmployee {
    _id?: string;
    restaurant_id: string;
    profile: {
        name: string;
        password?: string;
        email?: string;
        phone?: string;
        role?: 'owner' | 'staff';
    };
    isActive: boolean;
}
