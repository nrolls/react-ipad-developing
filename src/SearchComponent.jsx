import React, { useState } from 'react';

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooze = async (query) => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://boozeapi.com/api/v1/cocktails/search?q=${searchTerm}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setResults(data || []);
    } catch (err) {
      setError('Error searching drinks. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    
    // Debounce the API call to avoid too many requests
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchBooze(value);
    }, 500);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setError(null);
    clearTimeout(window.searchTimeout);
  };

  const selectDrink = (drink) => {
    setSearchTerm(drink.name);
    setResults([]);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for drinks..."
        />
        
        {searchTerm && (
          <button onClick={clearSearch}>
            Clear
          </button>
        )}
      </div>

      {loading && (
        <div>Searching...</div>
      )}

      {error && (
        <div style={{color: 'red'}}>
          {error}
        </div>
      )}

      {results.length > 0 && !loading && (
        <div>
          <div>
            {results.length} drink{results.length !== 1 ? 's' : ''} found
          </div>
          <ul>
            {results.map((drink, index) => (
              <li
                key={drink.id || index}
                onClick={() => selectDrink(drink)}
                style={{cursor: 'pointer', padding: '8px', borderBottom: '1px solid #eee'}}
              >
                <div>
                  <strong>{drink.name}</strong>
                  {drink.category && <span> - {drink.category}</span>}
                </div>
                {drink.description && (
                  <div style={{fontSize: '14px', color: '#666', marginTop: '4px'}}>
                    {drink.description.length > 100 
                      ? drink.description.substring(0, 100) + '...' 
                      : drink.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchTerm && results.length === 0 && !loading && !error && (
        <div>
          No drinks found for "{searchTerm}"
        </div>
      )}
    </div>
  );
}