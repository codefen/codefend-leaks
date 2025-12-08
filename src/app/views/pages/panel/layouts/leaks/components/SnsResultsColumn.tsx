import type { FC } from 'react';
import { IntelCard } from '@/app/views/pages/panel/layouts/sns/components/IntelCard';
import Masonry from 'react-masonry-css';

interface SnsResultsColumnProps {
	isLoading: boolean;
	error: string | null;
	hasSearched: boolean;
	results: any[];
	onOpenLeakedModal: (leaked: any, type: 'crack' | 'geo') => void;
	onDataClick: (keyword: string, searchClass: string) => void;
	onRetry: () => void;
	refetch: () => void;
}

export const SnsResultsColumn: FC<SnsResultsColumnProps> = ({
	isLoading,
	error,
	hasSearched,
	results,
	onOpenLeakedModal,
	onDataClick,
	onRetry,
	refetch,
}) => {
	return (
		<div className="results-column sns-column">
			<div className="column-header">
				<h2>SNS Results</h2>
				<span className="result-count">
					{hasSearched && !isLoading && results.length > 0 ? `${results.length} results` : ''}
				</span>
			</div>

			<div className="results-content">
				{isLoading && (
					<div className="loading-state">
						<div className="spinner"></div>
						<p>Searching SNS database...</p>
					</div>
				)}

				{!isLoading && error && (
					<div className="error-state">
						<div className="error-icon">⚠️</div>
						<h3>SNS Search Failed</h3>
						<p>{error}</p>
						<button className="btn btn-small" onClick={onRetry}>
							Retry SNS
						</button>
					</div>
				)}

				{!isLoading && !error && hasSearched && results.length === 0 && (
					<div className="empty-state">
						<div className="empty-icon">🔍</div>
						<h3>No SNS Results Found</h3>
						<p>No data leaks found in the SNS database for this query.</p>
					</div>
				)}

				{!isLoading && !error && results.length > 0 && (
					<div className="results-list sns-results">
						{results.length === 1 ? (
							<IntelCard
								intel={results[0]}
								onOpenLeakedModal={onOpenLeakedModal}
								refetch={refetch}
								onDataClick={onDataClick}
							/>
						) : (
							<Masonry
								breakpointCols={{ default: 2, 1400: 1 }}
								className="my-masonry-grid"
								columnClassName="my-masonry-grid_column">
								{results.map((intel: any, index: number) => (
									<IntelCard
										key={index}
										intel={intel}
										onOpenLeakedModal={onOpenLeakedModal}
										refetch={refetch}
										onDataClick={onDataClick}
									/>
								))}
							</Masonry>
						)}
					</div>
				)}

				{!hasSearched && !isLoading && (
					<div className="initial-state">
						<div className="initial-icon">🔐</div>
						<h3>SNS Data Breach Search</h3>
						<p>Search for leaked credentials and personal information across breach databases.</p>
					</div>
				)}
			</div>
		</div>
	);
};
