import React, { useState, useEffect, createContext, useContext } from 'react';

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
  <div className="min-h-screen flex items-center justify-center bg-neutral-50">
    <div className="text-center">
      <div className="inline-block w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-mono text-sm uppercase tracking-widest">Loading...</p>
    </div>
  </div>
);

// Error Component
const ErrorState = ({ message, onRetry }) => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
    <div className="text-center max-w-md">
      <div className="w-12 h-12 text-rose-500 mb-4 flex items-center justify-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="font-serif text-2xl font-bold mb-2">Something went wrong</h2>
      <p className="text-neutral-600 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="px-8 py-3 bg-black text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

// Header Component
const Header = () => {
  const { currentView, navigateTo, likedProducts } = useApp();

  return (
    <header className="border-b-4 border-black bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1
            onClick={() => navigateTo('home')}
            className="font-serif text-4xl font-black tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
          >
            STOREFRONT
          </h1>
        </div>

        <nav className="flex gap-8">
          <button
            onClick={() => navigateTo('home')}
            className={`font-mono text-xs uppercase tracking-[0.2em] font-semibold relative pb-2 transition-colors ${
              currentView === 'home'
                ? 'text-rose-500'
                : 'text-black hover:text-rose-500'
            }`}
          >
            Home
            {currentView === 'home' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500"></div>
            )}
          </button>

          <button
            onClick={() => navigateTo('products')}
            className={`font-mono text-xs uppercase tracking-[0.2em] font-semibold relative pb-2 transition-colors ${
              currentView === 'products'
                ? 'text-rose-500'
                : 'text-black hover:text-rose-500'
            }`}
          >
            Products
            {currentView === 'products' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500"></div>
            )}
          </button>

          <button
            onClick={() => navigateTo('favorites')}
            className={`font-mono text-xs uppercase tracking-[0.2em] font-semibold relative pb-2 transition-colors ${
              currentView === 'favorites'
                ? 'text-rose-500'
                : 'text-black hover:text-rose-500'
            }`}
          >
            Favorites
            {likedProducts.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-rose-500 text-white text-[10px] rounded-full">
                {likedProducts.length}
              </span>
            )}
            {currentView === 'favorites' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500"></div>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

// Hero Component
const Hero = () => {
  const { navigateTo } = useApp();

  return (
    <section className="bg-neutral-100 border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-600 mb-4">
          CURATED COLLECTION
        </p>
        <h2 className="font-serif text-6xl font-black mb-6 leading-tight">
          Premium Products<br />for Modern Living
        </h2>
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
  <button
    onClick={onClick}
    className="group bg-white border-4 border-black p-8 text-left hover:translate-x-[-6px] hover:translate-y-[-6px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
  >
    <h3 className="font-serif text-3xl font-bold mb-3 capitalize group-hover:text-rose-500 transition-colors">
      {category}
    </h3>
    <p className="font-mono text-xs uppercase tracking-wider text-neutral-600">
      {count} Products
    </p>
  </button>
);

// Home View
const HomeView = () => {
  const { categories, products, navigateTo, filterProducts } = useApp();

  const getCategoryCount = (category) => {
    return products.filter(p => p.category === category).length;
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="font-serif text-5xl font-black mb-12 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { likedProducts, dislikedProducts, toggleLike, toggleDislike, navigateTo } = useApp();

  const isLiked = likedProducts.includes(product.id);
  const isDisliked = dislikedProducts.includes(product.id);

  return (
    <div className="bg-white border-4 border-black overflow-hidden group hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className="relative overflow-hidden bg-neutral-100 aspect-square">
        <span className="absolute top-4 left-4 px-3 py-1 bg-white border-2 border-black font-mono text-[10px] uppercase tracking-wider z-10">
          {product.category}
        </span>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-6">
        <h3 className="font-serif text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h3>
        <p className="font-mono text-2xl font-black mb-4">
          ${product.price.toFixed(2)}
        </p>

        <div className="flex gap-2 mb-3">
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
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h2 className="font-serif text-5xl font-black mb-4">All Products</h2>
        <div className="flex gap-4 font-mono text-sm">
          <span className="text-neutral-600">
            Showing: <span className="font-bold text-black">{filteredProducts.length}</span>
          </span>
          <span className="text-neutral-400">•</span>
          <span className="text-neutral-600">
            Category: <span className="font-bold text-black capitalize">{currentFilter === 'all' ? 'All' : currentFilter}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-fadeIn"
          >
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h2 className="font-serif text-5xl font-black mb-4">Your Favorites</h2>
          <p className="font-serif text-2xl text-neutral-500 mb-2">No Favorites Yet</p>
          <p className="text-neutral-600 mb-8">
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
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="font-serif text-5xl font-black mb-12">
        Your Favorites ({favoriteProducts.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favoriteProducts.map((product, index) => (
          <div
            key={product.id}
            style={{ animationDelay: `${index * 50}ms` }}
            className="animate-fadeIn"
          >
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
    <div className="max-w-7xl mx-auto px-6 py-16">
      <button
        onClick={() => navigateTo('products')}
        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-black hover:text-white transition-all mb-8"
      >
        <span className="text-lg">←</span>
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-neutral-100 border-4 border-black p-12 aspect-square flex items-center justify-center">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <div>
          <span className="inline-block px-4 py-2 bg-white border-2 border-black font-mono text-xs uppercase tracking-wider mb-4">
            {selectedProduct.category}
          </span>

          <h1 className="font-serif text-5xl font-black mb-6 leading-tight">
            {selectedProduct.title}
          </h1>

          <div className="font-mono text-4xl font-black mb-8">
            ${selectedProduct.price.toFixed(2)}
          </div>

          <div className="flex gap-8 mb-8 pb-8 border-b-2 border-neutral-200">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-neutral-600 mb-2">
                Rating
              </p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="font-mono text-xl font-bold">
                  {selectedProduct.rating.rate}
                </span>
              </div>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-neutral-600 mb-2">
                Reviews
              </p>
              <p className="font-mono text-xl font-bold">
                {selectedProduct.rating.count}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold mb-4">
              Description:
            </h3>
            <p className="text-neutral-700 leading-relaxed text-lg">
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
  const { loading, error, currentView, } = useApp();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      {currentView === 'home' && (
        <>
          <Hero />
          <HomeView />
        </>
      )}

      {currentView === 'products' && <ProductsView />}
      {currentView === 'favorites' && <FavoritesView />}
      {currentView === 'detail' && <ProductDetailView />}
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
