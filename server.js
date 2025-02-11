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
    name: 'Cozy Sweater',
    description: 'Soft wool sweater for cold days',
    price: 4999,
    image: 'images/sweater.jpg',
    hasSizes: true, 
    category: 'womens'
  },
  {
    id: '2',
    name: 'Comfy Socks',
    description: 'Warm and breathable cotton socks',
    price: 1999,
    image: 'images/socks.jpg',
    hasSizes: true,
    category: 'accessories'
  }, 
  {
    id: '3',
    name: 'Chunky Knit Scarf',
    description: 'Thick, oversized knit scarf to keep you warm',
    price: 3499,
    image: 'images/scarf.jpg',
    hasSizes: false, 
    category: 'accessories'
  }, 
  {
    id: '4',
    name: 'Classic Beanie',
    description: 'Snug fit to keep your head warm',
    price: 1999,
    image: 'images/beanie.jpg',
    hasSizes: false, 
    category: 'accessories'
  }, 
  {
    id: '5',
    name: 'Pearl Earrings',
    description: 'Classic earrings for a night out',
    price: 2499,
    image: 'images/earrings.jpg',
    hasSizes: false, 
    category: 'jewelry'
  }, 
  {
    id: '6',
    name: 'Fuzzy Slippers',
    description: 'Goes well with some Comfy Socks',
    price: 3999,
    image: 'images/slippers.jpg',
    hasSizes: true, 
    category: 'accessories'
  }, 
  {
    id: '7',
    name: 'Heritage Knit Sweater',
    description: 'Perfect for layering on chilly days',
    price: 4999,
    image: 'images/mensweater.jpg',
    hasSizes: true, 
    category: 'mens'
  }, 
  {
    id: '8',
    name: 'Cozy Kids’ Cardigan',
    description: 'Made with breathable, durable fabric for all-day comfort',
    price: 3999,
    image: 'images/kidsweater.jpg',
    hasSizes: true, 
    category: 'kids'
  }
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