import { type FC } from 'react';
import { type LeaksSearchType } from '@/app/data/hooks/modules/leaks/useLeaks';
import { EmptyScreenView } from '@/app/views/components/EmptyScreenView/EmptyScreenView';
import { Loader } from '@/app/views/components/loaders/Loader';

interface LeaksResultsProps {
  searchType: LeaksSearchType;
  inxResults: any[];
  snsResults: any[];
  inxLoading: boolean;
  snsLoading: boolean;
  searchQuery: string;
}

export const LeaksResults: FC<LeaksResultsProps> = ({
  searchType,
  inxResults,
  snsResults,
  inxLoading,
  snsLoading,
  searchQuery,
}) => {
  const isLoading = inxLoading || snsLoading;
  const hasInxResults = inxResults && inxResults.length > 0;
  const hasSnsResults = snsResults && snsResults.length > 0;
  const hasAnyResults = hasInxResults || hasSnsResults;

  // Show loading state
  if (isLoading && !hasAnyResults) {
    return (
      <div className="leaks-results loading">
        <Loader />
        <p>Searching {searchType === 'all' ? 'all databases' : searchType.toUpperCase()}...</p>
      </div>
    );
  }

  // Show empty state if no search has been performed
  if (!searchQuery && !hasAnyResults) {
    return (
      <div className="leaks-results empty">
        <EmptyScreenView
          title="No Search Performed"
          info="Enter a search query and select a source to begin searching for leaks"
        />
      </div>
    );
  }

  // Show no results state
  if (searchQuery && !hasAnyResults && !isLoading) {
    return (
      <div className="leaks-results empty">
        <EmptyScreenView
          title="No Results Found"
          info={`No leaks found for "${searchQuery}" in ${searchType === 'all' ? 'any database' : searchType.toUpperCase()}`}
        />
      </div>
    );
  }

  return (
    <div className="leaks-results">
      {/* INX Results Section */}
      {(searchType === 'all' || searchType === 'inx') && (
        <div className="results-section inx-section">
          <div className="section-header">
            <h3>
              🕵️ Intelligence Results (INX)
              {hasInxResults && <span className="count">{inxResults.length}</span>}
            </h3>
            {inxLoading && <Loader />}
          </div>

          {hasInxResults ? (
            <div className="results-grid">
              {inxResults.map((result: any, index: number) => (
                <div key={`inx-${index}`} className="result-card inx-card">
                  <div className="result-header">
                    <span className="result-type">Intelligence</span>
                    <span className="result-date">
                      {result.createdAt || result.fecha || 'Unknown date'}
                    </span>
                  </div>
                  <div className="result-content">
                    <h4>{result.filename || result.title || 'Untitled'}</h4>
                    <p className="result-preview">
                      {result.preview || result.description || 'No description available'}
                    </p>
                  </div>
                  <div className="result-actions">
                    <button className="btn-preview">Preview</button>
                    <button className="btn-download">Download</button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchType === 'inx' || searchType === 'all' ? (
            <EmptyScreenView
              title="No INX Results"
              info="No intelligence data found for this query"
            />
          ) : null}
        </div>
      )}

      {/* SNS Results Section */}
      {(searchType === 'all' || searchType === 'sns') && (
        <div className="results-section sns-section">
          <div className="section-header">
            <h3>
              🔒 Social Security Results (SNS)
              {hasSnsResults && <span className="count">{snsResults.length}</span>}
            </h3>
            {snsLoading && <Loader />}
          </div>

          {hasSnsResults ? (
            <div className="results-grid">
              {snsResults.map((result: any, index: number) => (
                <div key={`sns-${index}`} className="result-card sns-card">
                  <div className="result-header">
                    <span className="result-type">Data Leak</span>
                    <span className="result-risk">{result.risk || 'Medium'}</span>
                  </div>
                  <div className="result-content">
                    <h4>{result.username || result.email || 'Unknown user'}</h4>
                    <p className="result-detail">
                      {result.source || 'Source unknown'} • {result.breach_date || 'Date unknown'}
                    </p>
                    {result.password && (
                      <div className="leak-info">
                        <span className="leak-label">Password:</span>
                        <span className="leak-value blur">••••••••</span>
                      </div>
                    )}
                  </div>
                  <div className="result-actions">
                    <button className="btn-details">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchType === 'sns' || searchType === 'all' ? (
            <EmptyScreenView
              title="No SNS Results"
              info="No social security leaks found for this query"
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

