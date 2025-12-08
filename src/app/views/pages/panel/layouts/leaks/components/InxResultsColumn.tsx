import type { FC } from 'react';

interface InxResultsColumnProps {
	isLoading: boolean;
	error: string | null;
	hasSearched: boolean;
	results: any[];
	onRetry: () => void;
}

export const InxResultsColumn: FC<InxResultsColumnProps> = ({
	isLoading,
	error,
	hasSearched,
	results,
	onRetry,
}) => {
	return (
		<div className="results-column inx-column">
			<div className="column-header">
				<h2>INX Results</h2>
				<span className="result-count">
					{hasSearched && !isLoading && results.length > 0 ? `${results.length} results` : ''}
				</span>
			</div>

			<div className="results-content">
				{isLoading && (
					<div className="loading-state">
						<div className="spinner"></div>
						<p>Searching INX intelligence...</p>
					</div>
				)}

				{!isLoading && error && (
					<div className="error-state">
						<div className="error-icon">⚠️</div>
						<h3>INX Search Failed</h3>
						<p>{error}</p>
						<button className="btn btn-small" onClick={onRetry}>
							Retry INX
						</button>
					</div>
				)}

				{!isLoading && !error && hasSearched && results.length === 0 && (
					<div className="empty-state">
						<div className="empty-icon">🔍</div>
						<h3>No INX Results Found</h3>
						<p>No intelligence data found in the dark web for this query.</p>
					</div>
				)}

				{!isLoading && !error && results.length > 0 && (
					<div className="results-list">
						{results.map((result: any, index: number) => (
							<div key={`inx-${index}`} className="result-card inx-card">
								<div className="result-header">
									<span className="result-type">INX</span>
									{result.risk && <span className="result-risk">{result.risk}</span>}
								</div>
								<div className="result-content">
									<h4>{result.title || result.filename || 'Intelligence Data Found'}</h4>
									{result.preview && (
										<p className="result-preview">{result.preview.substring(0, 200)}...</p>
									)}
									{result.source && <p className="result-source">Source: {result.source}</p>}
									{result.date && (
										<p className="result-date">Date: {new Date(result.date).toLocaleDateString()}</p>
									)}
								</div>
							</div>
						))}
					</div>
				)}

				{!hasSearched && !isLoading && (
					<div className="initial-state">
						<div className="initial-icon">🌐</div>
						<h3>INX Intelligence Search</h3>
						<p>Monitor dark web forums and threat intelligence sources for mentions.</p>
					</div>
				)}
			</div>
		</div>
	);
};
