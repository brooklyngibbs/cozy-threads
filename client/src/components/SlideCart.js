import React from 'react';
import { X, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SlideCart = ({ isOpen, onClose, cart, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Cart Panel */}
      <div 
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg 
                   transform transition-transform duration-300 ease-in-out z-50
                   ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-amber-100">
            <h2 className="text-lg font-medium text-amber-900">Your Cart</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-amber-50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-amber-900" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-amber-600 mb-4">Your cart is empty</p>
                <button 
                  onClick={onClose}
                  className="text-sm font-medium text-amber-900 hover:text-amber-700"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4 px-4">
                {cart.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 bg-amber-50 p-3 rounded-lg"
                  >
                    <div className="w-20 h-20 flex-shrink-0 bg-white rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-amber-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-amber-600">
                        Size: {item.size || 'M'}
                      </p>
                      <p className="text-sm font-medium text-amber-900">
                        ${(item.price / 100).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(index)}
                      className="p-2 text-amber-600 hover:text-amber-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-amber-100 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-amber-900">Total</span>
                <span className="text-lg font-medium text-amber-900">
                  ${(total / 100).toFixed(2)}
                </span>
              </div>

              <Link
                to="/checkout"
                className="flex items-center justify-center gap-2 w-full bg-amber-900 
                         text-white py-3 px-4 rounded-full font-medium
                         hover:bg-amber-800 transition-colors"
                onClick={onClose}
              >
                Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SlideCart;