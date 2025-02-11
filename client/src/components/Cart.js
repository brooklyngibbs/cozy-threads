import React from "react";

const Cart = ({ cart, removeFromCart }) => {
  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
              <img src={item.image} alt={item.name} style={{ width: "100px" }} />
              <h3>{item.name}</h3>
              <p>${(item.price / 100).toFixed(2)}</p>
              <button onClick={() => removeFromCart(index)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;