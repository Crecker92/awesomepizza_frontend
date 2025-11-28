import { Pizza } from "./pizza.model";
import { User } from "./user.model";

export type OrderStatus = 'pending' | 'in-progress' | 'completed';

export interface OrderItem {
    pizza: Pizza;
    quantity: number;
}

export interface OrderRaw {
    id: string;
    customer: User;
    items: OrderItem[];
    status: OrderStatus;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
    totalPrice: number;
}

export interface Order extends Omit<OrderRaw, 'createdAt' | 'updatedAt'> {
    createdAt: Date;
    updatedAt?: Date;
}

export interface OrderItemInput {
    id: string;
    quantity: number;
}

export interface OrderInput {
    items: OrderItemInput[];
    notes?: string;
}

export interface OrderAction {
    label: string;
    handler: (order: Order) => unknown;
    disabled: (order: Order) => boolean;
}