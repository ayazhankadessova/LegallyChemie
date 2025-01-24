import React, { useState, useRef, useEffect } from 'react'
import { X, Search, Plus } from 'lucide-react'
import config from '../config.js'
import PropTypes from 'prop-types'

const apiUrl = config.apiUrl

const SearchBar = ({ onProductAdded, isThemeChanged, day }) => {
  const [inputValue, setInputValue] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const performSearch = async () => {
    if (!inputValue.trim()) {
      setErrorMessage('Please enter a product name')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(`${apiUrl}/search/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to search products')
      }

      if (data.results && data.results.length === 0) {
        setErrorMessage(
          'No products found. Please try a different search term.'
        )
        setShowResults(false)
      } else {
        setSearchResults(data.results)
        setShowResults(true)
        setErrorMessage('')
      }
    } catch (error) {
      console.error('Search error:', error)
      setErrorMessage(error.message || 'Failed to search products')
      setShowResults(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInputValue(value)
    setErrorMessage('')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch()
  }

  const handleAddProduct = async (productUrl) => {
    try {
      const response = await fetch(`${apiUrl}/${day}/products`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_url: productUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Server response:', data)
        throw new Error(data.detail || 'Failed to add product')
      }

      if (data.message === "Product already in user's products list") {
        setErrorMessage('You already have this product in your routine 😭')
      } else {
        onProductAdded()
        setInputValue('')
        setSearchResults([])
        setShowResults(false)
        setErrorMessage('')
        alert('Product added successfully!')
        window.location.reload()
      }
    } catch (error) {
      console.error('Error adding product:', error)
      setErrorMessage(
        error.message || 'Failed to add product. Please try again.'
      )
    }
  }

  return (
    <div className='search-bar' ref={searchRef}>
      <form onSubmit={handleSearch} className='search-form'>
        <div className='search-input-container'>
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            placeholder='Search for a product...'
            className={`search-input ${
              isThemeChanged ? 'dark-theme' : 'light-theme'
            }`}
          />
          {inputValue && (
            <button
              type='button'
              onClick={() => {
                setInputValue('')
                setSearchResults([])
                setShowResults(false)
                setErrorMessage('')
              }}
              className='clear-button'
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type='submit'
          className={`search-button ${
            isThemeChanged ? 'dark-theme' : 'light-theme'
          }`}
        >
          <Search size={18} />
          Search
        </button>
      </form>

      {errorMessage && (
        <div
          className={`error-message ${
            isThemeChanged ? 'dark-theme' : 'light-theme'
          }`}
        >
          {errorMessage}
        </div>
      )}

      {isLoading && <div className='loading-message'>Searching...</div>}

      {showResults && searchResults.length > 0 && (
        <div className='search-results'>
          {searchResults.map((product, index) => (
            <div key={index} className='search-result-item'>
              <div className='product-info'>
                <img
                  src={product.image}
                  alt={product.name}
                  className='product-image'
                />
                <div className='product-details'>
                  <div className='product-brand'>{product.brand}</div>
                  <div className='product-name'>{product.name}</div>
                  <div className='product-description'>
                    {product.description}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleAddProduct(product.url)}
                className={`add-button ${
                  isThemeChanged ? 'dark-theme' : 'light-theme'
                }`}
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

SearchBar.propTypes = {
  onProductAdded: PropTypes.func.isRequired,
  isThemeChanged: PropTypes.bool.isRequired,
  day: PropTypes.string.isRequired,
}

export default SearchBar
