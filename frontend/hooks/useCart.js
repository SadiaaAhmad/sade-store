import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      addItem: (product, size, quantity = 1) => {
        const items = get().items;
        const key = `${product.id}-${size}`;
        const existing = items.find(i => i.key === key);
        if (existing) {
          set({ items: items.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i) });
        } else {
          set({
            items: [...items, {
              key,
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.discounted_price || product.price,
              image: product.images?.[0] || '',
              size,
              quantity,
            }],
          });
        }
      },

      removeItem: (key) => set({ items: get().items.filter(i => i.key !== key) }),

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) { get().removeItem(key); return; }
        set({ items: get().items.map(i => i.key === key ? { ...i, quantity } : i) });
      },

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: 'sade-cart' }
  )
);