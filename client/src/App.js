import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import SlideCart from "./components/SlideCart";
import CompletionPage from './pages/CompletionPage';
import ProductsPage from './pages/ProductsPage';

const App = () => {
  // Initialize cart with error handling
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cozyThreadsCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [storageError, setStorageError] = useState(false);

  // Save cart to localStorage with error handling
  useEffect(() => {
    try {
      localStorage.setItem('cozyThreadsCart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      setStorageError(true);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItem = prevCart.find(
        item => item.id === product.id && 
        (!item.size || item.size === product.size)
      );

      if (existingItem) {
        // Update quantity of existing item
        return prevCart.map(item =>
          item.id === product.id && (!item.size || item.size === product.size)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      // Add new item with quantity 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId, size, newQuantity) => {
    setCart(prevCart => {
      if (newQuantity < 1) {
        return prevCart.filter(item => 
          !(item.id === productId && (!size || item.size === size))
        );
      }
      return prevCart.map(item =>
        item.id === productId && (!size || item.size === size)
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  const clearCart = () => {
    try {
      setCart([]);
      setIsCartOpen(false);
      localStorage.removeItem('cozyThreadsCart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      setStorageError(true);
    }
  };

  const removeFromCart = (productId, size) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.id === productId && (!size || item.size === size))
      )
    );
  };

  // Calculate total items in cart (considering quantities)
  const cartItemsCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <Router>
      <div className="min-h-screen bg-amber-50">
        {storageError && (
          <div className="bg-red-500 text-white px-4 py-2 text-center text-sm">
            There was an error saving your cart. Your items may not persist after leaving the page.
          </div>
        )}
        <Navbar cartCount={cartItemsCount} onCartClick={() => setIsCartOpen(true)} />
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/products" element={<ProductsPage addToCart={addToCart} />} />
            <Route 
              path="/checkout" 
              element={<CheckoutPage cart={cart} updateQuantity={updateQuantity} />} 
            />
            <Route path="/completion" element={<CompletionPage clearCart={clearCart} />} />
          </Routes>
        </PageTransition>
        <SlideCart 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
        />
      </div>
    </Router>
  );
};

export default App;