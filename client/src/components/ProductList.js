import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Loader } from 'lucide-react';

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  const categories = ['all', 'womens', 'shoes', 'jewelry', 'accessories'];
  
  return (
    <div className="mb-8 overflow-x-auto pb-4">
      <div className="flex justify-start md:justify-center min-w-min px-4">
        <div className="inline-flex gap-2 p-1 bg-amber-100/50 rounded-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium 
                        transition-colors ${
                          activeCategory === category 
                            ? 'bg-amber-900 text-white' 
                            : 'text-amber-900 hover:bg-amber-200'
                        }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


const ProductCard = ({ product, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
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
    <div 
      className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="aspect-[3/4] overflow-hidden bg-cream-50 relative">
        <img 
          src={product.image} 
          alt={product.name}
          loading="lazy"  
          className={`w-full h-full object-cover object-center transition-transform duration-700 
                    ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black/10 transition-opacity duration-300
                    ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />

      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        <div className="mb-4">
          <h3 className="font-serif text-lg text-gray-900 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            ${(product.price / 100).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Sizes */}
        {hasSizes && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[2.5rem] h-9 px-2 rounded-md text-sm font-medium
                           transition-colors ${
                             selectedSize === size 
                               ? 'bg-gray-900 text-white' 
                               : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                           }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={hasSizes && !selectedSize}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 
                   rounded-lg transition-all transform
                   ${(!hasSizes || selectedSize)
                     ? 'bg-gray-900 text-white hover:bg-gray-800'
                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                   }`}
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products`)
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product => 
    activeCategory === 'all' || product.category === activeCategory
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <CategoryFilter 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            id={`product-${product.id}`}
            product={product} 
            addToCart={addToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-amber-600">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;