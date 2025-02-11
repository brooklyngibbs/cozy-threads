import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { Loader } from 'lucide-react';

// Load environment variables
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
const API_BASE_URL = process.env.REACT_APP_API_URL;

const CheckoutForm = ({ cart, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError('');

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setIsProcessing(false);
      return;
    }

    const { error: paymentError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (paymentError) {
      setError(paymentError.message);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 
                   rounded-full font-medium transition-colors
                   ${isProcessing 
                     ? 'bg-amber-100 text-amber-400 cursor-not-allowed' 
                     : 'bg-amber-900 text-white hover:bg-amber-800'}`}
      >
        {isProcessing ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${(cart.reduce((sum, item) => sum + item.price, 0) / 100).toFixed(2)}`
        )}
      </button>
    </form>
  );
};

const CheckoutPage = ({ cart }) => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (cart.length === 0) return;

    const getPaymentIntent = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/create-payment-intent`, {
          items: cart.map(item => ({
            id: item.id,
            quantity: 1
          }))
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error('Error creating payment intent:', err);
      }
    };

    getPaymentIntent();
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-serif text-amber-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-amber-600 mb-8">
            Add some items to your cart to proceed with checkout
          </p>
          <a 
            href="/"
            className="inline-flex items-center gap-2 bg-amber-100 hover:bg-amber-200 
                     text-amber-900 px-6 py-3 rounded-full font-medium transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-serif text-amber-900 mb-8">
          Checkout
        </h1>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-amber-900 mb-4">
                Order Summary
              </h2>
              
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-16 h-16 bg-amber-50 rounded-lg overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-amber-900">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-xs text-amber-600">Size: {item.size}</p>
                      )}
                      <p className="text-sm text-amber-900">
                        ${(item.price / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-amber-100 mt-4 pt-4">
                <div className="flex justify-between text-sm font-medium text-amber-900">
                  <span>Total</span>
                  <span>
                    ${(cart.reduce((sum, item) => sum + item.price, 0) / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-amber-900 mb-6">
                Payment Details
              </h2>

              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm cart={cart} clientSecret={clientSecret} />
                </Elements>
              ) : (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 text-amber-600 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;