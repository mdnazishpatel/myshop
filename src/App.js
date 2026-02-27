import React, { useState, useEffect, createContext, useContext } from 'react';
import { Camera, Heart, ThumbsDown, ArrowLeft, ShoppingBag, Filter, Star, Loader2, AlertCircle } from 'lucide-react';

// ============================================
// CONTEXT & STATE MANAGEMENT
// ============================================

const AppContext = createContext();

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [likedProducts, setLikedProducts] = useState(() => {
    const saved = localStorage.getItem('likedProducts');
    return saved ? JSON.parse(saved) : [];
  });
  const [dislikedProducts, setDislikedProducts] = useState(() => {
    const saved = localStorage.getItem('dislikedProducts');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch('https://fakestoreapi.com/products'),
          fetch('https://fakestoreapi.com/products/categories')
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData);
        setCategories(categoriesData);
        setFilteredProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Persist likes/dislikes to localStorage
  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
  }, [likedProducts]);

  useEffect(() => {
    localStorage.setItem('dislikedProducts', JSON.stringify(dislikedProducts));
  }, [dislikedProducts]);

  // Filter products
  const filterProducts = (category) => {
    setCurrentFilter(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === category));
    }
  };

  // Toggle like
  const toggleLike = (productId) => {
    setLikedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        setDislikedProducts(d => d.filter(id => id !== productId));
        return [...prev, productId];
      }
    });
  };

  // Toggle dislike
  const toggleDislike = (productId) => {
    setDislikedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        setLikedProducts(l => l.filter(id => id !== productId));
        return [...prev, productId];
      }
    });
  };

  // Navigation
  const navigateTo = (view, product = null) => {
    setCurrentView(view);
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const value = {
    products,
    categories,
    filteredProducts,
    currentFilter,
    likedProducts,
    dislikedProducts,
    loading,
    error,
    currentView,
    selectedProduct,
    filterProducts,
    toggleLike,
    toggleDislike,
    navigateTo,
    setError,
    setLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ============================================
// COMPONENTS
// ============================================

// Loading Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
    <Loader2 className="w-16 h-16 animate-spin text-rose-500" />
    <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 font-mono">
      Loading...
    </p>
  </div>
);

// Error Component
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-12 text-center">
    <AlertCircle className="w-20 h-20 text-rose-500" />
    <h3 className="text-3xl font-bold font-serif">Something went wrong</h3>
    <p className="text-neutral-600 max-w-md">{message}</p>
    <button
      onClick={onRetry}
      className="px-8 py-3 bg-black text-white uppercase tracking-wider text-sm font-mono font-semibold hover:bg-neutral-800 transition-all border-2 border-black hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      Try Again
    </button>
  </div>
);

// Header Component
const Header = () => {
  const { currentView, navigateTo, likedProducts } = useApp();

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b-2 border-black z-50">
      <nav className="max-w-[1600px] mx-auto px-8 py-6 flex justify-between items-center">
        <h1
          onClick={() => navigateTo('home')}
          className="font-serif text-4xl font-black tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
        >
          STOREFRONT
        </h1>
        
        <div className="flex gap-12 items-center">
          <button
            onClick={() => navigateTo('home')}
            className={`font-mono text-xs uppercase tracking-[0.2em] font-semibold relative pb-2 transition-colors ${
              currentView === 'home' ? 'text-rose-500' : 'text-black hover:text-rose-500'
            }`}
          >
            Home
            {currentView === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500" />
            )}
          </button>
          
          <button
            onClick={() => navigateTo('products')}
            className={`font-mono text-xs uppercase tracking-[0.2em] font-semibold relative pb-2 transition-colors ${
              currentView === 'products' ? 'text-rose-500' : 'text-black hover:text-rose-500'
            }`}
          >
            Products
            {currentView === 'products' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500" />
            )}
          </button>
          
          <button
            onClick={() => navigateTo('favorites')}
            className={`font-mono text-xs uppercase tracking-[0.2em] font-semibold relative pb-2 transition-colors ${
              currentView === 'favorites' ? 'text-rose-500' : 'text-black hover:text-rose-500'
            }`}
          >
            Favorites
            {likedProducts.length > 0 && (
              <span className="absolute -top-2 -right-3 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {likedProducts.length}
              </span>
            )}
            {currentView === 'favorites' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-500" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

// Hero Component
const Hero = () => {
  const { navigateTo } = useApp();

  return (
    <section className="min-h-[70vh] flex items-center justify-center text-center relative bg-gradient-to-br from-neutral-100 to-white border-b-2 border-black overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #e5e5e5 2px, #e5e5e5 4px)`
        }} />
      </div>
      
      <div className="relative z-10 px-8">
        <h1 className="font-serif text-7xl md:text-9xl font-black tracking-tighter mb-6 leading-none">
          CURATED<br />COLLECTION
        </h1>
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-600 mb-10 font-mono">
          Premium Products for Modern Living
        </p>
        <button
          onClick={() => navigateTo('products')}
          className="px-10 py-4 bg-black text-white uppercase tracking-[0.2em] text-sm font-mono font-semibold hover:bg-neutral-800 transition-all border-2 border-black hover:translate-x-[-6px] hover:translate-y-[-6px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          Explore Now
        </button>
      </div>
    </section>
  );
};

// Category Card Component
const CategoryCard = ({ category, count, onClick }) => (
  <div
    onClick={onClick}
    className="group border-2 border-black p-12 text-center cursor-pointer relative overflow-hidden bg-white transition-all hover:translate-x-[-8px] hover:translate-y-[-8px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  >
    <div className="absolute inset-0 bg-black transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
    <h3 className="font-serif text-3xl font-bold uppercase relative z-10 transition-colors group-hover:text-white mb-2">
      {category}
    </h3>
    <p className="text-sm text-neutral-600 relative z-10 transition-colors group-hover:text-neutral-300 font-mono">
      {count} Products
    </p>
  </div>
);

// Home View
const HomeView = () => {
  const { categories, products, navigateTo, filterProducts } = useApp();

  const getCategoryCount = (category) => {
    return products.filter(p => p.category === category).length;
  };

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-16">
      <h2 className="font-serif text-5xl font-bold mb-12 pb-6 border-b-2 border-black">
        Browse by Category
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map(category => (
          <CategoryCard
            key={category}
            category={category}
            count={getCategoryCount(category)}
            onClick={() => {
              navigateTo('products');
              setTimeout(() => filterProducts(category), 100);
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { likedProducts, dislikedProducts, toggleLike, toggleDislike, navigateTo } = useApp();
  const isLiked = likedProducts.includes(product.id);
  const isDisliked = dislikedProducts.includes(product.id);

  return (
    <div className="group border-2 border-black bg-white flex flex-col transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="h-80 flex items-center justify-center p-8 bg-neutral-50 border-b-2 border-black overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 font-mono">
          {product.category}
        </p>
        <h3 className="font-serif text-xl font-semibold mb-3 line-clamp-2 leading-tight">
          {product.title}
        </h3>
        <p className="text-3xl font-bold mb-4 font-mono">
          ${product.price.toFixed(2)}
        </p>
        
        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => toggleLike(product.id)}
            className={`flex-1 py-3 border-2 border-black font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
              isLiked
                ? 'bg-emerald-500 text-white border-emerald-500'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            {isLiked ? '♥ Liked' : '♡ Like'}
          </button>
          
          <button
            onClick={() => toggleDislike(product.id)}
            className={`flex-1 py-3 border-2 border-black font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
              isDisliked
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            {isDisliked ? 'Disliked' : 'Dislike'}
          </button>
        </div>
        
        <button
          onClick={() => navigateTo('detail', product)}
          className="w-full mt-3 py-3 bg-black text-white border-2 border-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Products View
const ProductsView = () => {
  const { filteredProducts, categories, currentFilter, filterProducts } = useApp();

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-16">
      <div className="flex justify-between items-center mb-12 pb-6 border-b-2 border-black flex-wrap gap-4">
        <h2 className="font-serif text-5xl font-bold">All Products</h2>
        <div className="flex gap-6 text-sm font-mono">
          <span className="text-neutral-600">
            Showing: <strong className="text-black">{filteredProducts.length}</strong>
          </span>
          <span className="text-neutral-600">
            Category: <strong className="text-black capitalize">{currentFilter === 'all' ? 'All' : currentFilter}</strong>
          </span>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap mb-12 p-6 border-2 border-black bg-neutral-50">
        <button
          onClick={() => filterProducts('all')}
          className={`px-6 py-3 border-2 border-black font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
            currentFilter === 'all'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-black hover:text-white'
          }`}
        >
          All Products
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => filterProducts(category)}
            className={`px-6 py-3 border-2 border-black font-mono text-xs uppercase tracking-wider font-semibold transition-all ${
              currentFilter === category
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {filteredProducts.map((product, index) => (
          <div key={product.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fadeIn">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Favorites View
const FavoritesView = () => {
  const { products, likedProducts, navigateTo } = useApp();
  const favoriteProducts = products.filter(p => likedProducts.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-8 py-16">
        <h2 className="font-serif text-5xl font-bold mb-12 pb-6 border-b-2 border-black">
          Your Favorites
        </h2>
        
        <div className="text-center py-24 border-2 border-black bg-neutral-50">
          <h3 className="font-serif text-3xl font-bold mb-4">No Favorites Yet</h3>
          <p className="text-neutral-600 mb-8 font-mono">
            Start exploring and like products to see them here!
          </p>
          <button
            onClick={() => navigateTo('products')}
            className="px-10 py-4 bg-black text-white uppercase tracking-[0.2em] text-sm font-mono font-semibold hover:bg-neutral-800 transition-all border-2 border-black hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-16">
      <h2 className="font-serif text-5xl font-bold mb-12 pb-6 border-b-2 border-black">
        Your Favorites ({favoriteProducts.length})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {favoriteProducts.map((product, index) => (
          <div key={product.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fadeIn">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Product Detail View
const ProductDetailView = () => {
  const { selectedProduct, navigateTo, likedProducts, dislikedProducts, toggleLike, toggleDislike } = useApp();

  if (!selectedProduct) return null;

  const isLiked = likedProducts.includes(selectedProduct.id);
  const isDisliked = dislikedProducts.includes(selectedProduct.id);

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-16">
      <button
        onClick={() => navigateTo('products')}
        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-black hover:text-white transition-all mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="border-2 border-black p-12 bg-neutral-50 flex items-center justify-center sticky top-32 h-fit">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="max-w-full max-h-[600px] object-contain"
          />
        </div>

        <div className="py-8">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-500 mb-4 font-mono">
            {selectedProduct.category}
          </p>
          
          <h1 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-8">
            {selectedProduct.title}
          </h1>
          
          <div className="text-5xl font-bold mb-8 py-6 border-y-2 border-black font-mono">
            ${selectedProduct.price.toFixed(2)}
          </div>

          <div className="flex gap-8 mb-8 py-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 font-mono">
                Rating
              </p>
              <p className="text-3xl font-bold flex items-center gap-2 font-mono">
                {selectedProduct.rating.rate}
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2 font-mono">
                Reviews
              </p>
              <p className="text-3xl font-bold font-mono">
                {selectedProduct.rating.count}
              </p>
            </div>
          </div>

          <div className="mb-8 p-8 bg-neutral-50 border-2 border-black">
            <strong className="font-mono text-sm uppercase tracking-wider block mb-4">Description:</strong>
            <p className="text-base leading-relaxed text-neutral-700">
              {selectedProduct.description}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => toggleLike(selectedProduct.id)}
              className={`flex-1 py-4 border-2 border-black font-mono text-sm uppercase tracking-[0.15em] font-semibold transition-all ${
                isLiked
                  ? 'bg-emerald-500 text-white border-emerald-500'
                  : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              {isLiked ? '♥ Liked' : '♡ Add to Favorites'}
            </button>
            
            <button
              onClick={() => toggleDislike(selectedProduct.id)}
              className={`flex-1 py-4 border-2 border-black font-mono text-sm uppercase tracking-[0.15em] font-semibold transition-all ${
                isDisliked
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              {isDisliked ? 'Disliked' : 'Not Interested'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { loading, error, currentView, setLoading } = useApp();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24">
        {currentView === 'home' && (
          <>
            <Hero />
            <HomeView />
          </>
        )}
        {currentView === 'products' && <ProductsView />}
        {currentView === 'favorites' && <FavoritesView />}
        {currentView === 'detail' && <ProductDetailView />}
      </main>
    </div>
  );
};

// Root Component with Provider
const Root = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default Root;
