import React, { useState, useRef, useEffect } from 'react'
import { X, Search, Plus } from 'lucide-react'
import config from '../config.js'
import PropTypes from 'prop-types'

const apiUrl = config.apiUrl
const frontendUrl = config.frontendUrl

const SearchBar = ({ onProductAdded, isThemeChanged, day }) => {
  const [inputValue, setInputValue] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  // Close search results when clicking outside
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
    setErrorMessage('') // Clear any previous errors

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
    setErrorMessage('') // Clear error when user types
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
        body: JSON.stringify({ product_url: productUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
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
      <form onSubmit={handleSearch} className='flex gap-2'>
        <div className='relative flex-1'>
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            placeholder='Search for a product...'
            className={isThemeChanged ? 'dark-theme' : 'light-theme'}
            style={{
              border: isThemeChanged
                ? 'solid 2px #00B4D8'
                : 'solid 2px #fd76c9',
              color: isThemeChanged ? '#0077B6' : '#FF5EC1',
            }}
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
              className='absolute right-3 top-1/2 transform -translate-y-1/2'
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          className={isThemeChanged ? 'dark-theme' : 'light-theme'}
          style={{
            cursor: isThemeChanged
              ? `url('/select2.png') 2 2, pointer`
              : `url('/select1.png') 2 2, pointer`,
          }}
          type='submit'
        >
          Search
        </button>
      </form>

      {/* Error Message Display */}
      {errorMessage && (
        <div
          className={`mt-2 p-3 rounded-lg ${
            isThemeChanged
              ? 'bg-blue-50 text-blue-600'
              : 'bg-pink-50 text-pink-600'
          } border ${isThemeChanged ? 'border-blue-200' : 'border-pink-200'}`}
        >
          {errorMessage}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className='mt-2 text-center py-4 text-gray-500'>Searching...</div>
      )}

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className='absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto'>
          {searchResults.map((product, index) => (
            <div
              key={index}
              className='p-4 hover:bg-gray-50 border-b last:border-b-0'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-16 h-16 object-cover rounded'
                  />
                  <div>
                    <div className='font-medium text-gray-900'>
                      {product.brand}
                    </div>
                    <div className='text-sm text-gray-600'>{product.name}</div>
                    <div className='text-xs text-gray-500 mt-1'>
                      {product.description}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleAddProduct(product.url)}
                  className={isThemeChanged ? 'dark-theme' : 'light-theme'}
                  style={{
                    cursor: isThemeChanged
                      ? `url('/select2.png') 2 2, pointer`
                      : `url('/select1.png') 2 2, pointer`,
                  }}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
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
