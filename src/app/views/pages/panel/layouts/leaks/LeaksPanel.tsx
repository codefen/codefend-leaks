import { useState, useEffect, type FC, useCallback } from 'react';
import { useShowScreen } from '#commonHooks/useShowScreen';
import { useLeaks } from '@/app/data/hooks/modules/leaks/useLeaks';
import { useGlobalFastFields } from '@/app/views/context/AppContextProvider';
import { APP_EVENT_TYPE } from '@/app/data/interfaces/panel';
import useModal from '#commonHooks/useModal';
import { useUserData } from '#commonUserHooks/useUserData';
import ConfirmModal from '@modals/ConfirmModal';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper';
import Show from '@/app/views/components/Show/Show';
import { useLeakedData } from '@moduleHooks/sns/useLeakedData';
import { SnsLeakedDataModal } from '@/app/views/pages/panel/layouts/sns/components/SnsLeakedDataModal';
import { LeaksTopBar } from './components/LeaksTopBar';
import { SnsResultsColumn } from './components/SnsResultsColumn';
import { InxResultsColumn } from './components/InxResultsColumn';
import './leaks.scss';

const MODAL_KEY_OPEN = {
	LOGOUT: 'logout',
};

export const LeaksPanel: FC = () => {
	const [activeButton, setActiveButton] = useState<string | null>(null);
	const [showScreen] = useShowScreen();
	const { appEvent } = useGlobalFastFields(['appEvent']);
	const { showModal, setShowModal, setShowModalStr, showModalStr } = useModal();
	const { logout } = useUserData();

	const { searchType, setSearchType, searchAll, isSearching, inx, sns, remainingSearches } =
		useLeaks();

	const [searchQuery, setSearchQuery] = useState('');

	const { leaked, leakedType, showModal: showLeakedModal, handleOpenLeakedModal, handleCloseLeakedModal } = useLeakedData();

	const mapSnsClassToLeaksType = useCallback((snsClass: string): typeof searchType => {
		const mapping: Record<string, typeof searchType> = {
			'email': 'email',
			'lastip': 'ip',
			'_domain': 'domain',
			'username': 'username',
			'password': 'password',
			'hash': 'hash',
			'name': 'name',
		};
		return (mapping[snsClass] || 'email') as typeof searchType;
	}, []);

	const handleDataClick = useCallback((keyword: string, snsClass: string) => {
		const leaksType = mapSnsClassToLeaksType(snsClass);
		setSearchQuery(keyword);
		setSearchType(leaksType);
		// Pasar el tipo directamente a searchAll para evitar usar el estado desactualizado
		searchAll(keyword, leaksType);
	}, [mapSnsClassToLeaksType, searchAll, setSearchType]);

	const refetch = useCallback(() => {}, []);

	useEffect(() => {
		appEvent.set(APP_EVENT_TYPE.LEAKS_PAGE_CONDITION);
	}, []);

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;
		await searchAll(searchQuery);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !isSearching) {
			handleSearch();
		}
	};

	const handleLogout = () => {
		handleClickStyleProxy('logout');
		setShowModalStr(MODAL_KEY_OPEN.LOGOUT);
		setShowModal(true);
	};

	const handleClickStyleProxy = (buttonId: string) => {
		setActiveButton(buttonId);
		setTimeout(() => setActiveButton(null), 300);
	};

	return (
		<>
			<Show when={showModal && showModalStr === MODAL_KEY_OPEN.LOGOUT}>
				<ModalWrapper action={() => setShowModal(!showModal)}>
					<ConfirmModal
						header="ARE YOU SURE YOU WANT TO LOGOUT?"
						cancelText="Cancel"
						confirmText="Logout"
						close={() => setShowModal(!showModal)}
						action={() => {
							logout();
						}}
					/>
				</ModalWrapper>
			</Show>

			<main className={`leaks-panel ${showScreen ? 'actived' : ''}`}>
				<LeaksTopBar
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					searchType={searchType}
					setSearchType={setSearchType}
					isSearching={isSearching}
					remainingSearches={remainingSearches}
					onSearch={handleSearch}
					onKeyPress={handleKeyPress}
					onLogout={handleLogout}
					activeButton={activeButton}
					onProxyClick={handleClickStyleProxy}
				/>

				<div className="leaks-results-container">
					<SnsResultsColumn
						isLoading={sns.isLoading}
						error={sns.error}
						hasSearched={sns.hasSearched}
						results={sns.results}
						onOpenLeakedModal={handleOpenLeakedModal}
						onDataClick={handleDataClick}
						onRetry={sns.retry}
						refetch={refetch}
					/>

					<InxResultsColumn
						isLoading={inx.isLoading}
						error={inx.error}
						hasSearched={inx.hasSearched}
						results={inx.results}
						onRetry={inx.retry}
					/>
				</div>
			</main>

			<SnsLeakedDataModal
				type={leakedType}
				isActive={showLeakedModal}
				close={handleCloseLeakedModal}
				leaked={leaked}
				searchClass={searchType}
				limitReached={() => {}}
				updateCompany={() => {}}
			/>
		</>
	);
};

export default LeaksPanel;
