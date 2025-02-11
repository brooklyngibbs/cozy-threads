import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Loader } from 'lucide-react';

// Helper function for size options
const getSizeOptions = (productName) => {
    return ['XS', 'S', 'M', 'L', 'XL'];
};

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  const categories = ['all', 'mens', 'womens', 'kids', 'jewelry', 'accessories'];
  
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
      {/* Image Container - Fixed aspect ratio */}
      <div className="aspect-[4/5] overflow-hidden bg-amber-50">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center transition-transform duration-700 
                   group-hover:scale-105"
        />
      </div>

      {/* Content - Flex grow to fill space */}
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
              <label className="block text-xs font-medium text-amber-700 mb-2">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {getSizeOptions(product.name).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-auto px-3 h-9 rounded-full text-sm font-medium
                             transition-colors ${
                               selectedSize === size 
                                 ? 'bg-amber-900 text-white' 
                                 : 'bg-white text-amber-900 hover:bg-amber-200'
                             }
                             focus:outline-none focus:ring-2 focus:ring-amber-500`}
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

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex gap-2 text-xs text-amber-600 mt-4">
              {product.tags.map(tag => (
                <span key={tag} className="bg-white px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductList = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const API_BASE_URL = process.env.REACT_APP_API_URL;
  
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