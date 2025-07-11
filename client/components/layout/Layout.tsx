import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';
import ChatWidget from '@/components/chat/ChatWidget';
import { useAuthStore } from '@/store/authStore';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on app load
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className={`pt-20 ${className}`}>
        {children}
      </main>
      
      <Footer />
      
      {/* Cart Sidebar */}
      <CartSidebar />
      
      {/* Chat Widget */}
      <ChatWidget />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#36454F',
            borderRadius: '12px',
            border: '1px solid #E5E4E2',
            boxShadow: '0 10px 25px rgba(212, 175, 55, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#D4AF37',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;