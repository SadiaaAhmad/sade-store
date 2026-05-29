import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlist = create(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (product) => {
        const exists = get().items.some(i => i.id === product.id);
        if (exists) {
          set({ items: get().items.filter(i => i.id !== product.id) });
        } else {
          set({ items: [...get().items, product] });
        }
      },

      isWishlisted: (productId) => get().items.some(i => i.id === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'sade-wishlist' }
  )
);