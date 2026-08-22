import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryType, Product } from '../types';
import {
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  List,
  X,
  RotateCcw,
  Search,
  Check,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategoryFilter,
    setSelectedSubcategoryFilter,
    navigateTo,
    formatPrice,
  } = useShop();

  const [genderFilter, setGenderFilter] = useState<'all' | 'men' | 'women' | 'unisex'>('all');
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(20000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyOnSale, setOnlyOnSale] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'discount'>('featured');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [layoutView, setLayoutView] = useState<'grid-4' | 'grid-3' | 'list'>('grid-4');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available sizes in Pakistan (EU standard)
  const allSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46];

  const allColors = [
    { name: 'Black', hex: '#111827' },
    { name: 'Brown / Tan', hex: '#8B4513' },
    { name: 'Mustard', hex: '#C2843A' },
    { name: 'Maroon', hex: '#6B1D2F' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#DC2626' },
    { name: 'Green / Emerald', hex: '#0F5132' },
  ];

  const categoriesMap: { id: CategoryType; label: string }[] = [
    { id: 'men', label: "Men's Footwear" },
    { id: 'women', label: "Women's Footwear" },
    { id: 'peshawari', label: 'Peshawari Chappals' },
    { id: 'khussa', label: 'Handcrafted Khussas' },
    { id: 'formal', label: 'Formal Leather' },
    { id: 'sneakers', label: 'Sneakers & Streetwear' },
    { id: 'heels', label: 'Heels & Pumps' },
    { id: 'sandals', label: 'Kolhapuris & Sandals' },
    { id: 'sale', label: 'Clearance Sale' },
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (selectedCategory === 'sale') {
        if (!item.discountPercentage) return false;
      } else if (selectedCategory === 'men') {
        if (item.gender !== 'men' && item.gender !== 'unisex') return false;
      } else if (selectedCategory === 'women') {
        if (item.gender !== 'women' && item.gender !== 'unisex') return false;
      } else if (selectedCategory !== 'all') {
        if (item.category !== selectedCategory) return false;
      }

      // Subcategory filter from mega-menu
      if (selectedSubcategoryFilter) {
        if (!item.subcategory.toLowerCase().includes(selectedSubcategoryFilter.toLowerCase())) {
          return false;
        }
      }

      // Gender subfilter
      if (genderFilter !== 'all') {
        if (item.gender !== genderFilter && item.gender !== 'unisex') return false;
      }

      // Search keyword filter
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesBrand = item.brand.toLowerCase().includes(query);
        const matchesSub = item.subcategory.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesSub) return false;
      }

      // Price slider
      if (item.price > priceMax) return false;

      // In-stock
      if (onlyInStock && !item.inStock) return false;

      // On-sale
      if (onlyOnSale && !item.discountPercentage) return false;

      // Sizes filter
      if (selectedSizes.length > 0) {
        const hasSize = selectedSizes.some((s) => item.sizes.includes(s));
        if (!hasSize) return false;
      }

      // Colors filter
      if (selectedColors.length > 0) {
        const hasColor = item.colors.some((c) =>
          selectedColors.some((sc) => c.name.toLowerCase().includes(sc.toLowerCase()))
        );
        if (!hasColor) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [
    products,
    selectedCategory,
    selectedSubcategoryFilter,
    genderFilter,
    searchFilter,
    priceMax,
    onlyInStock,
    onlyOnSale,
    selectedSizes,
    selectedColors,
    sortBy,
  ]);

  const toggleSize = (sz: number) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const toggleColor = (col: string) => {
    setSelectedColors((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategoryFilter(null);
    setGenderFilter('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceMax(20000);
    setOnlyInStock(false);
    setOnlyOnSale(false);
    setSearchFilter('');
    setSortBy('featured');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedSubcategoryFilter ? 1 : 0) +
    (genderFilter !== 'all' ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (priceMax < 20000 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyOnSale ? 1 : 0) +
    (searchFilter ? 1 : 0);

  const getCategoryHeading = () => {
    if (selectedSubcategoryFilter) return selectedSubcategoryFilter;
    if (selectedCategory === 'all') return 'All Footwear Collection';
    if (selectedCategory === 'peshawari') return 'Authentic Peshawari Chappals';
    if (selectedCategory === 'khussa') return 'Handcrafted Royal Khussas';
    if (selectedCategory === 'sale') return 'Flash Deals & Clearance Sale';
    return selectedCategory.replace('-', ' ');
  };

  return (
    <div id="shop-catalog-page" className="bg-neutral-50/40 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
          <button onClick={() => navigateTo('home')} className="hover:text-neutral-900 transition-colors">
            Home
          </button>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">Catalog</span>
          {selectedCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="text-neutral-900 font-bold uppercase">{selectedCategory}</span>
            </>
          )}
          {selectedSubcategoryFilter && (
            <>
              <span>/</span>
              <span className="text-amber-700 font-bold">{selectedSubcategoryFilter}</span>
            </>
          )}
        </div>

        {/* Page Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-neutral-200 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight capitalize">
              {getCategoryHeading()}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Showing {filteredProducts.length} handcrafted products available with Cash on Delivery across Pakistan.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name, material..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 1. Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-sm font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
                  Filter Catalog
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* Categories Navigation */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-neutral-700 block">
                  Category
                </label>
                <div className="space-y-1">
                  {categoriesMap.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedSubcategoryFilter(null);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedCategory === cat.id && !selectedSubcategoryFilter
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="text-xs font-black uppercase tracking-wider text-neutral-700 block">
                  Target Gender
                </label>
                <div className="grid grid-cols-3 gap-1 bg-neutral-100 p-1 rounded-xl text-xs font-bold">
                  {(['all', 'men', 'women'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGenderFilter(g)}
                      className={`py-1.5 rounded-lg capitalize transition-all ${
                        genderFilter === g
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* PKR Price Range Slider */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-black uppercase tracking-wider text-neutral-700">
                    Max Price (PKR)
                  </label>
                  <span className="font-bold text-neutral-900">{formatPrice(priceMax)}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="20000"
                  step="500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-neutral-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400">
                  <span>{formatPrice(2000)}</span>
                  <span>{formatPrice(20000)}</span>
                </div>
              </div>

              {/* Footwear Size (EU) */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="text-xs font-black uppercase tracking-wider text-neutral-700 block">
                  Size (EU / PK)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {allSizes.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        onClick={() => toggleSize(sz)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Swatch */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="text-xs font-black uppercase tracking-wider text-neutral-700 block">
                  Color Swatch
                </label>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((col) => {
                    const isSelected = selectedColors.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        onClick={() => toggleColor(col.name)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-neutral-300 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        {col.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* In Stock & Sale Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-neutral-100 text-xs font-semibold text-neutral-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded accent-neutral-900 w-4 h-4 cursor-pointer"
                  />
                  <span>In-Stock Ready to Ship</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyOnSale}
                    onChange={(e) => setOnlyOnSale(e.target.checked)}
                    className="rounded accent-neutral-900 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-red-600 font-bold">Clearance Deals (Discounted)</span>
                </label>
              </div>
            </div>
          </div>

          {/* 2. Products List Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Control Bar: Filter pills, sort & view */}
            <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>

              {/* Active Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-lg font-semibold">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')}>
                      <X className="w-3 h-3 hover:text-red-500" />
                    </button>
                  </span>
                )}
                {selectedSubcategoryFilter && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold">
                    Type: {selectedSubcategoryFilter}
                    <button onClick={() => setSelectedSubcategoryFilter(null)}>
                      <X className="w-3 h-3 hover:text-red-500" />
                    </button>
                  </span>
                )}
                {genderFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-lg font-semibold">
                    Gender: {genderFilter}
                    <button onClick={() => setGenderFilter('all')}>
                      <X className="w-3 h-3 hover:text-red-500" />
                    </button>
                  </span>
                )}
                {selectedSizes.map((sz) => (
                  <span
                    key={sz}
                    className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-800 px-2 py-1 rounded-lg font-semibold"
                  >
                    Size EU {sz}
                    <button onClick={() => toggleSize(sz)}>
                      <X className="w-3 h-3 hover:text-red-500" />
                    </button>
                  </span>
                ))}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-rose-600 font-bold hover:underline ml-1"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Sort & Layout Toggle */}
              <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-neutral-400 font-medium hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-neutral-100 border border-transparent hover:border-neutral-300 rounded-xl px-3 py-1.5 font-bold text-neutral-800 focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Featured Picks</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="discount">Biggest Discount</option>
                    <option value="newest">New Arrivals</option>
                  </select>
                </div>

                <div className="hidden sm:flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                  <button
                    onClick={() => setLayoutView('grid-4')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      layoutView === 'grid-4' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                    }`}
                    title="4 Column Grid"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayoutView('grid-3')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      layoutView === 'grid-3' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                    }`}
                    title="3 Column Grid"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayoutView('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      layoutView === 'list' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500'
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">No matching footwear found</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                    Try adjusting your size, price range, or category filter to discover available styles.
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : layoutView === 'list' ? (
              <div className="space-y-4">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} layout="list" />
                ))}
              </div>
            ) : (
              <div
                className={`grid gap-3 sm:gap-5 ${
                  layoutView === 'grid-3'
                    ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} layout="grid" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <h3 className="text-base font-bold text-neutral-900">Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-neutral-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-neutral-500">Category</span>
              <div className="space-y-1">
                {categoriesMap.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedSubcategoryFilter(null);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold ${
                      selectedCategory === cat.id ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
