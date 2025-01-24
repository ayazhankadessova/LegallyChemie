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
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${apiUrl}/search/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue }),
      })

      if (!response.ok) throw new Error('Search failed')

      const data = await response.json()
      setSearchResults(data.results)
      setShowResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setErrorMessage('Failed to search products')
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
    e.preventDefault() // Prevent form submission
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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to add product')
      }

      const data = await response.json()
      if (data.message === "Product already in user's products list") {
        setErrorMessage('You already have this product in your routine 😭')
      } else {
        onProductAdded()
        setInputValue('')
        setSearchResults([])
        setShowResults(false)
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
    <div className='relative w-full max-w-xl' ref={searchRef}>
      <form onSubmit={handleSearch} className='flex gap-2'>
        <div className='relative flex-1'>
          <input
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            placeholder='Search for a product...'
            className={`w-full px-4 py-2 rounded-lg ${
              isThemeChanged
                ? 'bg-blue-50 border-blue-400'
                : 'bg-pink-50 border-pink-400'
            } border-2 focus:outline-none focus:ring-2 ${
              isThemeChanged ? 'focus:ring-blue-300' : 'focus:ring-pink-300'
            }`}
          />
          {inputValue && (
            <button
              type='button'
              onClick={() => {
                setInputValue('')
                setSearchResults([])
                setShowResults(false)
              }}
              className='absolute right-3 top-1/2 transform -translate-y-1/2'
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type='submit'
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isThemeChanged
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-pink-500 hover:bg-pink-600'
          } text-white transition-colors`}
        >
          <Search size={18} />
          Search
        </button>
      </form>

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
                  className={`ml-4 px-3 py-2 rounded-lg flex items-center gap-1 ${
                    isThemeChanged
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-pink-500 hover:bg-pink-600'
                  } text-white transition-colors`}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className='text-center py-4 text-gray-500'>Searching...</div>
      )}

      {errorMessage && (
        <div
          className={`mt-2 text-sm ${
            isThemeChanged ? 'text-blue-600' : 'text-pink-600'
          }`}
        >
          {errorMessage}
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
