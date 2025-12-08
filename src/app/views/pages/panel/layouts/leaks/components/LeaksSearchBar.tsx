import { type FC } from 'react';
import { type LeaksSearchType } from '@/app/data/hooks/modules/leaks/useLeaks';

interface LeaksSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: LeaksSearchType;
  setSearchType: (type: LeaksSearchType) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export const LeaksSearchBar: FC<LeaksSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  onSearch,
  isSearching,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      onSearch();
    }
  };

  return (
    <div className="leaks-search-bar card">
      <div className="search-type-selector">
        <button
          className={`type-btn ${searchType === 'all' ? 'active' : ''}`}
          onClick={() => setSearchType('all')}
          disabled={isSearching}>
          <span className="icon">🔍</span>
          <span>All Sources</span>
        </button>
        <button
          className={`type-btn ${searchType === 'inx' ? 'active' : ''}`}
          onClick={() => setSearchType('inx')}
          disabled={isSearching}>
          <span className="icon">🕵️</span>
          <span>Intelligence (INX)</span>
        </button>
        <button
          className={`type-btn ${searchType === 'sns' ? 'active' : ''}`}
          onClick={() => setSearchType('sns')}
          disabled={isSearching}>
          <span className="icon">🔒</span>
          <span>Social Security (SNS)</span>
        </button>
      </div>

      <div className="search-input-container">
        <input
          type="text"
          className="search-input"
          placeholder={
            searchType === 'all'
              ? 'Search across all leak databases...'
              : searchType === 'inx'
                ? 'Search intelligence databases...'
                : 'Search for emails, domains, IPs, names...'
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSearching}
        />
        <button
          className="search-btn"
          onClick={onSearch}
          disabled={isSearching || !searchQuery.trim()}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {searchType === 'all' && (
        <div className="search-info">
          <p>
            🔍 Searching both Intelligence and Social Security databases simultaneously
          </p>
        </div>
      )}
    </div>
  );
};

