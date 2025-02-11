import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Plus, Loader } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL; // Use environment variable

const ProductCard = ({ product, addToCart }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const hasSizes = product.hasSizes;
  
  const handleAddToCart = () => {
    setIsLoading(true);
    const productToAdd = hasSizes 
      ? { ...product, size: selectedSize || 'M' }
      : product;
    
    addToCart(productToAdd);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden h-full">
      {/* Image */}
      <div className="aspect-[4/5] overflow-hidden bg-amber-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6 bg-amber-100/50">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-lg font-medium text-amber-900 leading-tight">
            {product.name}
          </h3>
          <span className="text-sm font-medium text-amber-700 whitespace-nowrap">
            ${(product.price / 100).toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-amber-600 line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Size Selection */}
        <div className="mt-auto">
          {hasSizes && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-auto px-3 h-9 rounded-full text-sm font-medium
                             transition-colors ${
                               selectedSize === size 
                                 ? 'bg-amber-900 text-white' 
                                 : 'bg-white text-amber-900 hover:bg-amber-200'
                             }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={hasSizes && !selectedSize}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 
                     rounded-lg transition-colors ${
                       (!hasSizes || selectedSize)
                         ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                         : 'bg-amber-50 text-amber-400 cursor-not-allowed'
                     }`}
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        setProducts(res.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    searchQuery 
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-serif text-amber-900 mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
        </h1>
        {searchQuery && (
          <p className="text-amber-600">
            Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            addToCart={addToCart}
          />
        ))}
      </div>

      {/* No Results Message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-amber-600">
            No products found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;