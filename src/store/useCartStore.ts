/**
 * Shopping Cart Store
 *
 * Manages cart state with Zustand and localStorage persistence.
 * Handles adding/removing items, calculating totals, and clearing cart.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  ticketTierId: string;
  eventId: string;
  eventName: string;
  tierName: string;
  price: number;
  quantity: number;
  maxPerOrder: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (ticketTierId: string, quantity: number) => void;
  removeItem: (ticketTierId: string) => void;
  clearCart: () => void;
  totalAmount: () => number;
  totalItems: () => number;
  getItemQuantity: (ticketTierId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Add item to cart or update quantity if already exists
       */
      addItem: (item: CartItem) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.ticketTierId === item.ticketTierId
          );

          if (existingItem) {
            // Update quantity (respect max limit)
            const newQuantity = Math.min(
              existingItem.quantity + item.quantity,
              item.maxPerOrder
            );
            return {
              items: state.items.map((i) =>
                i.ticketTierId === item.ticketTierId
                  ? { ...i, quantity: newQuantity }
                  : i
              ),
            };
          }

          // Add new item
          return { items: [...state.items, item] };
        }),

      /**
       * Update quantity for a specific item
       */
      updateQuantity: (ticketTierId: string, quantity: number) =>
        set((state) => {
          if (quantity <= 0) {
            // Remove if quantity is 0 or negative
            return {
              items: state.items.filter((i) => i.ticketTierId !== ticketTierId),
            };
          }

          return {
            items: state.items.map((i) => {
              if (i.ticketTierId === ticketTierId) {
                // Respect max per order limit
                const newQuantity = Math.min(quantity, i.maxPerOrder);
                return { ...i, quantity: newQuantity };
              }
              return i;
            }),
          };
        }),

      /**
       * Remove item from cart
       */
      removeItem: (ticketTierId: string) =>
        set((state) => ({
          items: state.items.filter((i) => i.ticketTierId !== ticketTierId),
        })),

      /**
       * Clear all items from cart
       */
      clearCart: () => set({ items: [] }),

      /**
       * Calculate total cart amount
       */
      totalAmount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      /**
       * Get total number of items in cart
       */
      totalItems: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },

      /**
       * Get quantity for a specific ticket tier
       */
      getItemQuantity: (ticketTierId: string) => {
        const { items } = get();
        const item = items.find((i) => i.ticketTierId === ticketTierId);
        return item ? item.quantity : 0;
      },
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
);
