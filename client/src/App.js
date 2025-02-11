import React, { useState } from "react";
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
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
    setIsCartOpen(true);
  };

  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-amber-50">
        <Navbar cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
        <PageTransition>
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/products" element={<ProductsPage addToCart={addToCart} />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
            <Route path="/completion" element={<CompletionPage clearCart={clearCart} />} />
          </Routes>
        </PageTransition>
        <SlideCart 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          removeFromCart={removeFromCart}
        />
      </div>
    </Router>
  );
};

export default App;