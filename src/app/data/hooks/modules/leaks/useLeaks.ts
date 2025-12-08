import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useFetcher } from '#commonHooks/useFetcher.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { apiErrorValidation, companyIdIsNull, verifySession } from '@/app/constants/validations';
import { APP_MESSAGE_TOAST } from '@/app/constants/app-toast-texts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider';
import { useOrderStore } from '@stores/orders.store';
import { OrderSection, ResourcesTypes } from '@interfaces/order';
import { APP_EVENT_TYPE } from '@interfaces/panel';
import { mapIntelData } from '@utils/mapper';

export type SearchType = 'email' | 'domain' | 'username' | 'password' | 'name' | 'hash' | 'ip';

interface SearchResult {
	results: any[];
	isLoading: boolean;
	error: string | null;
	hasSearched: boolean;
}

export const useLeaks = () => {
	const { getCompany, getUserdata, logout, company } = useUserData();
	const [snsSearchFetcher, , isSnsLoading] = useFetcher();
	const [inxSearchFetcher, , isInxLoading] = useFetcher();

	const [searchType, setSearchType] = useState<SearchType>('email');

	// Guardar la última query para retry
	const lastSearchQueryRef = useRef<string>('');
	const lastSearchTypeRef = useRef<SearchType>('email');

	// Independent state for each search
	const [snsState, setSnsState] = useState<SearchResult>({
		results: [],
		isLoading: false,
		error: null,
		hasSearched: false,
	});

	const [inxState, setInxState] = useState<SearchResult>({
		results: [],
		isLoading: false,
		error: null,
		hasSearched: false,
	});

	const appEvent = useGlobalFastField('appEvent');
	const { updateState } = useOrderStore();

	// Control de toasts duplicados
	const activeToastsRef = useRef<Set<string>>(new Set());

	const showToastOnce = (
		message: string,
		type: 'success' | 'error' | 'warning' | 'info' = 'warning'
	) => {
		if (activeToastsRef.current.has(message)) return;

		activeToastsRef.current.add(message);
		toast[type](message, {
			onClose: () => activeToastsRef.current.delete(message),
			autoClose: 5000,
		});
	};

	// Map search type to SNS class
	const mapSearchTypeToSnsClass = (type: SearchType): string => {
		const mapping: Record<SearchType, string> = {
			email: 'email',
			domain: '_domain',
			ip: 'lastip',
			name: 'name',
			username: 'username',
			password: 'password',
			hash: 'hash',
		};
		return mapping[type] || 'email';
	};

	const limitReached = () => {
		updateState('open', true);
		updateState('orderStepActive', OrderSection.PAYWALL_MAX_SCAN);
		updateState('resourceType', ResourcesTypes.WEB);
		appEvent.set(APP_EVENT_TYPE.LIMIT_REACHED_SNS);
	};

	const updateCompany = (companyUpdated: any) => {
		if (companyUpdated) company.set(companyUpdated);
	};

	// SNS Search - Independiente con manejo de errores
	const searchSns = useCallback(
		async (query: string, type: SearchType): Promise<void> => {
			const companyID = getCompany();
			if (companyIdIsNull(companyID)) return;

			setSnsState(prev => ({ ...prev, isLoading: true, error: null }));

			try {
				const { data } = await snsSearchFetcher('post', {
					body: {
						company_id: companyID,
						keyword: query.trim(),
						class: mapSearchTypeToSnsClass(type),
					},
					path: 'sns/search',
				});

				let parsedData: any = data;
				if (typeof data === 'string') {
					parsedData = JSON.parse(String(data).trim());
				}

				// Validaciones de sesión y API
				if (verifySession(parsedData, logout)) {
					setSnsState(prev => ({ ...prev, isLoading: false }));
					return;
				}

				if (apiErrorValidation(parsedData)) {
					const errorMessage = parsedData.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR;
					const errorCode = parsedData?.error_info || 'generic';

					throw { message: errorMessage, code: errorCode };
				}

				// Procesar resultados
				const arrayOfObjects = parsedData?.response?.results
					? Object.entries(parsedData.response.results).map(([key, value]) => {
							const name = key.split('_').slice(1, -2).join('_');
							return { name, value };
					  })
					: [];

				// Actualizar company data
				updateCompany(parsedData.company);

				// Verificar si hay resultados
				if (arrayOfObjects.length === 0 || parsedData.response.size === 0) {
					setSnsState({
						results: [],
						isLoading: false,
						error: null,
						hasSearched: true,
					});
					showToastOnce('No SNS results found', 'info');
				} else {
					setSnsState({
						results: arrayOfObjects,
						isLoading: false,
						error: null,
						hasSearched: true,
					});
				}
			} catch (error: any) {
				// Manejo específico de errores
				const errorMessage = error.message || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR;

				setSnsState({
					results: [],
					isLoading: false,
					error: errorMessage,
					hasSearched: true,
				});

				// Casos especiales
				switch (error.code) {
					case 'paid_user_leaksearch_maximum_reached':
					case 'leaksearch_maximum_reached':
						limitReached();
						break;
					default:
						console.error(`SNS Error: ${errorMessage}`, 'error');
				}
			}
		},
		[snsSearchFetcher, getCompany, logout, company]
	);

	// INX Search - Independiente con manejo de errores
	const searchInx = useCallback(
		async (query: string): Promise<void> => {
			const companyID = getCompany();
			if (companyIdIsNull(companyID)) return;

			setInxState(prev => ({ ...prev, isLoading: true, error: null }));

			try {
				const { data } = await inxSearchFetcher('post', {
					body: {
						company_id: companyID,
						keyword: query.trim(),
						offset: 0,
					},
					path: 'inx/search',
				});

				// Parsear data si es string
				let parsedData: any = data;
				if (typeof data === 'string') {
					parsedData = JSON.parse(String(data).trim());
				}

				if (verifySession(parsedData, logout)) {
					setInxState(prev => ({ ...prev, isLoading: false }));
					return;
				}
				if (apiErrorValidation(parsedData)) {
					const errorMessage = parsedData.info || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR;
					const errorCode = parsedData?.error_info || 'generic';

					throw { message: errorMessage, code: errorCode };
				}

				// Procesar resultados
				const intelResult = parsedData.records
					? parsedData.records.map((intel: any) => mapIntelData(intel))
					: [];

				// Actualizar company si viene en la respuesta
				if (parsedData.company) {
					updateCompany(parsedData.company);
				}

				if (intelResult.length === 0) {
					setInxState({
						results: [],
						isLoading: false,
						error: null,
						hasSearched: true,
					});
					showToastOnce('No INX results found', 'info');
				} else {
					setInxState({
						results: intelResult,
						isLoading: false,
						error: null,
						hasSearched: true,
					});
				}
			} catch (error: any) {
				const errorMessage = error.message || APP_MESSAGE_TOAST.API_UNEXPECTED_ERROR;

				setInxState({
					results: [],
					isLoading: false,
					error: errorMessage,
					hasSearched: true,
				});

				switch (error.code) {
					case 'paid_user_leaksearch_maximum_reached':
					case 'leaksearch_maximum_reached':
						limitReached();
						break;
					default:
						console.error(`SNS Error: ${errorMessage}`, 'error');
				}
			}
		},
		[inxSearchFetcher, getCompany, logout]
	);

	// Búsqueda combinada - Ejecuta ambas en paralelo
	const searchAll = useCallback(
		async (query: string, typeOverride?: SearchType): Promise<void> => {
			if (!query.trim()) {
				showToastOnce('Please enter a search query', 'warning');
				return;
			}

			// Usar el tipo proporcionado o el tipo actual
			const searchTypeToUse = typeOverride || searchType;

			// Guardar la última búsqueda para retry
			lastSearchQueryRef.current = query;
			lastSearchTypeRef.current = searchTypeToUse;

			// Resetear estados previos
			setSnsState(prev => ({ ...prev, hasSearched: false }));
			setInxState(prev => ({ ...prev, hasSearched: false }));

			// Ejecutar ambas búsquedas en paralelo con Promise.allSettled
			// Esto asegura que si una falla, la otra continúe
			const [snsResult, inxResult] = await Promise.allSettled([
				searchSns(query, searchTypeToUse),
				searchInx(query),
			]);

			// Logging opcional para debugging
			if (snsResult.status === 'rejected') {
				console.error('SNS search failed:', snsResult.reason);
			}
			if (inxResult.status === 'rejected') {
				console.error('INX search failed:', inxResult.reason);
			}
		},
		[searchSns, searchInx, searchType]
	);

	// Retry solo SNS
	const retrySns = useCallback(async (): Promise<void> => {
		if (!lastSearchQueryRef.current) {
			showToastOnce('No previous search to retry', 'warning');
			return;
		}
		await searchSns(lastSearchQueryRef.current, lastSearchTypeRef.current);
	}, [searchSns]);

	// Retry solo INX
	const retryInx = useCallback(async (): Promise<void> => {
		if (!lastSearchQueryRef.current) {
			showToastOnce('No previous search to retry', 'warning');
			return;
		}
		await searchInx(lastSearchQueryRef.current);
	}, [searchInx]);

	// Clear all results
	const clearAll = useCallback(() => {
		setSnsState({
			results: [],
			isLoading: false,
			error: null,
			hasSearched: false,
		});
		setInxState({
			results: [],
			isLoading: false,
			error: null,
			hasSearched: false,
		});
	}, []);

	// Remaining searches desde company data
	const remainingSearches = company.get?.disponibles_sns || 0;
	const remainingInxSearches = company.get?.disponibles_sns || 0;

	// Estado de carga global
	const isSearching = snsState.isLoading || inxState.isLoading;

	return {
		// Search control
		searchType,
		setSearchType,
		searchAll,
		clearAll,
		isSearching,

		// SNS data
		sns: {
			results: snsState.results,
			isLoading: snsState.isLoading,
			error: snsState.error,
			hasSearched: snsState.hasSearched,
			retry: retrySns,
		},

		// INX data
		inx: {
			results: inxState.results,
			isLoading: inxState.isLoading,
			error: inxState.error,
			hasSearched: inxState.hasSearched,
			retry: retryInx,
		},

		// Credits/searches remaining
		remainingSearches,
		remainingInxSearches,
	};
};
