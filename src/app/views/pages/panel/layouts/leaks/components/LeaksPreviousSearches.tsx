import { type FC, useState } from 'react';

interface LeaksPreviousSearchesProps {
  inxSearches: any[];
  snsSearches: any[];
  onSelectSearch: (query: string) => void;
}

export const LeaksPreviousSearches: FC<LeaksPreviousSearchesProps> = ({
  inxSearches,
  snsSearches,
  onSelectSearch,
}) => {
  const [activeTab, setActiveTab] = useState<'inx' | 'sns'>('inx');

  const currentSearches = activeTab === 'inx' ? inxSearches : snsSearches;
  const hasSearches = currentSearches && currentSearches.length > 0;

  return (
    <div className="card previous-searches">
      <h3>Previous Searches</h3>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'inx' ? 'active' : ''}`}
          onClick={() => setActiveTab('inx')}>
          INX ({inxSearches?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === 'sns' ? 'active' : ''}`}
          onClick={() => setActiveTab('sns')}>
          SNS ({snsSearches?.length || 0})
        </button>
      </div>

      <div className="searches-list">
        {hasSearches ? (
          currentSearches.map((search: any, index: number) => (
            <button
              key={`${activeTab}-search-${index}`}
              className="search-item"
              onClick={() => onSelectSearch(search.query || search.search || '')}>
              <div className="search-icon">
                {activeTab === 'inx' ? '🕵️' : '🔒'}
              </div>
              <div className="search-details">
                <span className="search-query">
                  {search.query || search.search || 'Unknown'}
                </span>
                <span className="search-date">
                  {search.createdAt || search.fecha || 'Recent'}
                </span>
              </div>
              <div className="search-results-count">
                {search.results || search.count || 0} results
              </div>
            </button>
          ))
        ) : (
          <div className="no-searches">
            <p>No previous {activeTab.toUpperCase()} searches</p>
          </div>
        )}
      </div>
    </div>
  );
};

