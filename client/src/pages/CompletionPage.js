import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const CompletionPage = ({ clearCart }) => {
  const navigate = useNavigate();
  const [orderNumber] = useState(
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );

  // Clear the cart when reaching this page
  useEffect(() => {
    if (clearCart) {
      clearCart();
    }
  }, [clearCart]);

  // Redirect to home if user refreshes the completion page
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/', { replace: true });
    }, 10000); // Redirect after 10 seconds

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-serif text-amber-900 mb-4">
          Thank you for your order!
        </h1>

        <p className="text-amber-600 mb-8">
          Your order has been confirmed and will be shipped soon.
          We'll send you an email with tracking information once your order is on its way.
        </p>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <p className="text-sm text-amber-600 mb-2">Order number</p>
          <p className="text-lg font-medium text-amber-900 mb-4">
            #{orderNumber}
          </p>
          <p className="text-sm text-amber-600">
            You will receive an email confirmation shortly.
          </p>
        </div>

        <Link 
          to="/"
          className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 
                   text-amber-900 px-8 py-4 rounded-full font-medium transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CompletionPage;