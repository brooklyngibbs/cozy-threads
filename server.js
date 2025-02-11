require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors()); 
app.use(bodyParser.json()); 


const products = [
  {
    id: '1',
    name: 'The Luxe Wool Sweater',
    description: 'A premium, ultra-soft wool sweater designed for effortless warmth and elevated style.',
    price: 6999,
    image: 'images/sweater.jpg',
    hasSizes: true, 
    category: 'womens'
  },
  {
    id: '2',
    name: 'The Essential Knit Lounge Set',
    description: 'A chic two-piece knit set that transitions seamlessly from cozy to stylish.',
    price: 8999,
    image: 'images/knitset.jpg',
    hasSizes: true, 
    category: 'womens'
  }, 
  {
    id: '3',
    name: 'Signature Gold Hoops',
    description: 'Timeless and versatile, these lightweight gold hoops add effortless elegance to any look.',
    price: 2499,
    image: 'images/hoops.jpg',
    hasSizes: false, 
    category: 'jewelry'
  },
  {
    id: '4',
    name: 'The Dainty Back Chain',
    description: 'A delicate gold back chain designed to add a subtle, sultry detail to your evening wear.',
    price: 2999,
    image: 'images/backchain.jpg',
    hasSizes: false, 
    category: 'jewelry'
  }, 
  {
    id: '5',
    name: 'The Iconic White Boots',
    description: 'Sleek, knee-high statement boots designed to elevate any outfit with modern sophistication.',
    price: 7999,
    image: 'images/boots.jpg',
    hasSizes: true, 
    category: 'shoes'
  },
  {
    id: '6',
    name: 'The Timeless Peacoat',
    description: 'A structured, tailored peacoat in classic khaki—your go-to for effortless layering.',
    price: 8999,
    image: 'images/coat.jpg',
    hasSizes: true, 
    category: 'womens'
  },
  {
    id: '7',
    name: 'The Everyday Gold Necklace',
    description: 'A minimalist gold chain that’s perfect for layering for an understated luxe look.',
    price: 3499,
    image: 'images/goldnecklace.jpg',
    hasSizes: false, 
    category: 'jewelry'
  },
  {
    id: '8',
    name: 'Stacked Gold Ring Set',
    description: 'A curated set of modern gold rings designed for stacking or styling solo.',
    price: 3299,
    image: 'images/goldrings.jpg',
    hasSizes: false, 
    category: 'jewelry'
  },
  {
    id: '9',
    name: 'Stacked Silver Ring Set',
    description: 'A sleek and modern set of silver rings designed for effortless stacking.',
    price: 3299,
    image: 'images/silverrings.jpg',
    hasSizes: false, 
    category: 'jewelry'
  },
];

// API Endpoints

// Fetch Products
app.get('/products', (req, res) => {
  res.json(products);
});

// Create Payment Intent
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { items } = req.body;

    const totalAmount = items.reduce((total, item) => {
      const product = products.find((p) => p.id === item.id);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});