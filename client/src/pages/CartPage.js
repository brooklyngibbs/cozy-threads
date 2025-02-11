import React from "react";

const Cart = ({ cart, removeFromCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-xl font-serif text-amber-900 mb-4">Your Cart</h2>
      
      {cart.length === 0 ? (
        <p className="text-amber-700">Your cart is empty.</p>
      ) : (
        <div>
          <div className="space-y-3">
            {cart.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 bg-white rounded-lg shadow-sm p-2"
              >
                <div className="w-16 h-16 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-amber-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-amber-700">
                    ${(item.price / 100).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  className="text-xs text-rose-500 hover:text-rose-700 transition-colors px-2 py-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-amber-100 pt-4">
            <div className="flex justify-between text-sm font-medium text-amber-900">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;