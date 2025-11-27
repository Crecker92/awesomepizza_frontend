import { Pizza } from "./pizza.model";
import { User } from "./user.model";

export type OrderStatus = 'pending' | 'in-progress' | 'completed';

export interface OrderItem {
    pizza: Pizza;
    quantity: number;
}

export interface Order {
    id: string;
    customer: User;
    items: OrderItem[];
    status: OrderStatus;
    notes?: string;
    createdAt: Date;
    updatedAt?: Date;
    totalPrice: number;
}

export interface OrderItemInput {
    id: string;
    quantity: number;
}

export interface OrderInput {
    items: OrderItemInput[];
    notes?: string;
}