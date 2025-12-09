import type { FC, KeyboardEvent } from 'react';
import { lazy } from 'react';
import { ThemeChangerButton } from '@buttons/index';
import { LogoutIcon } from '@icons';
import SelectField from '@/app/views/components/SelectField/SelectField';

const Logo = lazy(() => import('@/app/views/components/Logo/Logo'));

interface LeaksTopBarProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	searchType: string;
	setSearchType: (type: any) => void;
	isSearching: boolean;
	remainingSearches: number | string;
	onSearch: () => void;
	onKeyPress: (e: KeyboardEvent) => void;
	onLogout: () => void;
	activeButton: string | null;
	onProxyClick: (id: string) => void;
}

const searchTypeOptions = [
	{ value: 'email', label: 'Email' },
	{ value: 'domain', label: 'Domain' },
	{ value: 'username', label: 'Username' },
	{ value: 'password', label: 'Password' },
	{ value: 'name', label: 'Full Name' },
	{ value: 'hash', label: 'Hash' },
	{ value: 'ip', label: 'IP Address' },
];

export const LeaksTopBar: FC<LeaksTopBarProps> = ({
	searchQuery,
	setSearchQuery,
	searchType,
	setSearchType,
	isSearching,
	remainingSearches,
	onSearch,
	onKeyPress,
	onLogout,
	activeButton,
	onProxyClick,
}) => {
	return (
		<div className="leaks-topbar">
			<div className="leaks-logo">
				<span className="logo-icon">
					<Logo theme="aimColor" />
				</span>
				<span className="logo-text">codefend</span>
			</div>

			<div className="search-controls">
				<input
					type="text"
					className="search-input"
					placeholder="Search for emails, domains, IPs, names, hashes..."
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
					onKeyDown={onKeyPress}
					disabled={isSearching}
				/>

				<SelectField
					options={searchTypeOptions}
					onChange={e => setSearchType(e.target.value as any)}
					value={searchType}
					required
				/>

				<button
					className="btn btn-red"
					onClick={onSearch}
					disabled={isSearching || !searchQuery.trim()}>
					{isSearching ? 'Searching...' : 'Search'}
				</button>
			</div>

			<div className="remaining-badge">
				<span className="label">Remaining searches:</span>
				<span className="count">{remainingSearches}</span>
			</div>

			<div className="actions">
				<ThemeChangerButton
					proxyClick={() => onProxyClick('theme')}
					className={`${activeButton === 'theme' ? 'active' : ''}`}
				/>
				<button
					className={`logout-btn action ${activeButton === 'logout' ? 'active' : ''}`}
					onClick={onLogout}
					title="Logout">
					<LogoutIcon width={1} height={1} />
					<span className="ripple-effect"></span>
				</button>
			</div>
		</div>
	);
};
