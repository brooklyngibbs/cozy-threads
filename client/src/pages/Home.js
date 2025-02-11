import React from 'react';
import ProductList from '../components/ProductList';
import { ShoppingBag, Leaf, Heart, Sparkles } from 'lucide-react';

const ValueProp = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-8 bg-amber-50/50 rounded-2xl">
    <div className="bg-amber-100 p-3 rounded-xl mb-4">
      <Icon className="w-6 h-6 text-amber-700" />
    </div>
    <h3 className="font-medium text-lg text-amber-900 mb-2">{title}</h3>
    <p className="text-sm text-amber-600">{description}</p>
  </div>
);

const Home = ({ addToCart }) => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    productsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section with Images */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Text Content */}
          <div className="text-left animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-serif text-amber-900 mb-6">
              Effortless Style, Timeless Comfort
            </h1>
            <p className="text-xl text-amber-700 mb-8">
              ethically-sourced, sustainably-made pieces for your everyday comfort
            </p>
            <button
              onClick={scrollToProducts}
              className="inline-flex items-center gap-2 bg-amber-900 text-white hover:bg-amber-800 
         px-8 py-4 rounded-full font-medium transition-all hover:scale-105"
            >
              Shop the Collection
              <ShoppingBag className="w-5 h-5" />
            </button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src="images/home5.jpg"
                  alt="Cozy fashion"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="images/home6.jpg"
                  alt="Sustainable fashion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img
                  src="images/home7.jpg"
                  alt="Ethical fashion"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src="images/home8.jpg"
                  alt="Conscious fashion"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Values Section with Background Image */}
        <div className="relative mb-24">
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <img
              src="images/background.jpg"
              alt="Background"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="relative grid md:grid-cols-3 gap-6 max-w-5xl mx-auto p-8">
            <ValueProp
              icon={Leaf}
              title="Sustainable Materials"
              description="Better fabrics, better future. Thoughtfully crafted from eco-friendly materials."
            />
            <ValueProp
              icon={Heart}
              title="Ethically Made"
              description="Fair wages, safe workplaces. Your style, made responsibly."
            />
            <ValueProp
              icon={Sparkles}
              title="Timeless Style"
              description="Classic pieces that outlast trends—effortless, refined, and forever stylish."
            />
          </div>
        </div>

        {/* Products Section */}
        <div id="products-section" className="relative pb-16">
          <ProductList addToCart={addToCart} />
        </div>
      </div>
    </div>
  );
};

export default Home;