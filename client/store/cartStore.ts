import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { Product, CartItem, CartStore } from '@/types';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, quantity: number = 1) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          item => item.product._id === product._id
        );

        if (existingItemIndex >= 0) {
          // Item already exists, update quantity
          const updatedItems = [...currentItems];
          const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
          
          // Check stock limit
          if (newQuantity > product.stock) {
            toast.error(`Only ${product.stock} items available in stock`);
            return;
          }
          
          updatedItems[existingItemIndex].quantity = newQuantity;
          set({ items: updatedItems });
          toast.success(`Updated ${product.name} quantity`);
        } else {
          // Check stock availability
          if (quantity > product.stock) {
            toast.error(`Only ${product.stock} items available in stock`);
            return;
          }
          
          // Add new item
          const newItem: CartItem = {
            product,
            quantity,
          };
          
          set({ items: [...currentItems, newItem] });
          toast.success(`${product.name} added to cart`);
        }
      },

      removeItem: (productId: string) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find(item => item.product._id === productId);
        
        if (itemToRemove) {
          const updatedItems = currentItems.filter(item => item.product._id !== productId);
          set({ items: updatedItems });
          toast.success(`${itemToRemove.product.name} removed from cart`);
        }
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const currentItems = get().items;
        const itemIndex = currentItems.findIndex(item => item.product._id === productId);
        
        if (itemIndex >= 0) {
          const item = currentItems[itemIndex];
          
          // Check stock limit
          if (quantity > item.product.stock) {
            toast.error(`Only ${item.product.stock} items available in stock`);
            return;
          }
          
          const updatedItems = [...currentItems];
          updatedItems[itemIndex].quantity = quantity;
          set({ items: updatedItems });
        }
      },

      clearCart: () => {
        set({ items: [] });
        toast.success('Cart cleared');
      },

      toggleCart: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price;
          return total + (price * item.quantity);
        }, 0);
      },

      // Additional helper methods
      getItemCount: (productId: string) => {
        const item = get().items.find(item => item.product._id === productId);
        return item ? item.quantity : 0;
      },

      isInCart: (productId: string) => {
        return get().items.some(item => item.product._id === productId);
      },

      getSubtotal: () => {
        return get().getTotalPrice();
      },

      getShipping: () => {
        const subtotal = get().getTotalPrice();
        // Free shipping over $100
        return subtotal >= 100 ? 0 : 15;
      },

      getTax: () => {
        const subtotal = get().getTotalPrice();
        // 8% tax rate
        return subtotal * 0.08;
      },

      getFinalTotal: () => {
        const subtotal = get().getTotalPrice();
        const shipping = get().getShipping();
        const tax = get().getTax();
        return subtotal + shipping + tax;
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items 
      }),
    }
  )
);