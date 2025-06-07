import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import productsData from '../../Products.json';

function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSortOption, setFilterSortOption] = useState('all');

  useEffect(() => {
    const handleSearchQuery = (e) => {
      setSearchQuery(e.detail.toLowerCase());
    };

    window.addEventListener('searchQueryChanged', handleSearchQuery);
    return () => window.removeEventListener('searchQueryChanged', handleSearchQuery);
  }, []);

  const handleFilterSort = () => {
    let filtered = [...productsData];

    if (filterSortOption === 'New' || filterSortOption === 'Sale') {
      filtered = filtered.filter(product => product.tag === filterSortOption);
    }

    if (filterSortOption === 'low') {
      filtered.sort((a, b) =>
        parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
      );
    }

    if (filterSortOption === 'high') {
      filtered.sort((a, b) =>
        parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''))
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(product =>
        product.Productname.toLowerCase().includes(searchQuery)
      );
    }
    return filtered;
  };

  const displayedProducts = handleFilterSort();

  const addToCart = (product) => {
    try {
      const existing = JSON.parse(localStorage.getItem('cart')) || [];
      const alreadyCart = existing.find(p => p.id === product.id);

      if (!alreadyCart) {
        const updatedProduct = { ...product, quantity: 1 };
        const updatedCart = [...existing, updatedProduct];
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success(`${product.Productname} Added to your Cart!`);
      } else {
        toast.info(`${product.Productname} is already in your Cart!`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart.');
    }
  };

  return (
    <>
      <div className="shop-container">
        <div className="container">
          <h1 className="text-dark py-4 fw-semibold">Products</h1>
          <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className='text-muted' style={{ fontSize: '1.1rem' }}>
                Showing <strong>{displayedProducts.length}</strong> Product{displayedProducts.length !== 1 && 's'} for "
                {filterSortOption === 'all' ? 'All' : filterSortOption.charAt(0).toUpperCase() + filterSortOption.slice(1)}"
              </div>
              <div>
                <select
                  className='form-select py-2 fs-6'
                  style={{ minWidth: '260px', backgroundColor: '#f5f5f5', border: '0px' }}
                  value={filterSortOption}
                  onChange={(e) => setFilterSortOption(e.target.value)}
                >
                  <option value="all">All Products</option>
                  <option value="New">New Products</option>
                  <option value="Sale">Sale Products</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            {displayedProducts.length === 0 ? (
              <div className='col-12'>
                <div className='alert alert-danger text-center'>
                  No Products found Matching your search
                </div>
              </div>
            ) : (
              displayedProducts.map(product => (
                <div className='col-lg-3 col-md-4 mb-4' key={product.id}>
                  <div className="product-item text-center position-relative shadow pb-4">
                    <div className="product-image w-100 position-relative overflow-hidden">
                      <img src={product.image} className='img-fluid' alt={product.Productname} />
                      <img src={product.secondImage} className='img-fluid' alt={product.Productname} />
                      <div className="product-icons gap-3">
                        <div className="product-icon" onClick={() => addToCart(product)}>
                          <i className='bi bi-cart3 fs-5'></i>
                        </div>
                      </div>
                      {product.tag && (
                        <span className={`tag badge text-white ${product.tag === 'New' ? 'bg-danger' : 'bg-success'}`}>
                          {product.tag}
                        </span>
                      )}
                    </div>
                    <div className="product-container border-top pt-3">
                      {product.oldprice ? (
                        <span className='price'>
                          <span className='text-muted text-decoration-line-through me-2'>{product.oldprice}</span>
                          <span className='fw-bold text-danger'>{product.price}</span>
                        </span>
                      ) : (
                        <span className='price'>{product.price}</span>
                      )}
                      <h3 className='title pt-1'>{product.Productname}</h3>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default Index;