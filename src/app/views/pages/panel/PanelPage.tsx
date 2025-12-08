import { Suspense, useEffect, lazy, useMemo, useCallback, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { Loader } from '@/app/views/components/loaders/Loader.tsx';
import { useUserData } from '#commonUserHooks/useUserData.ts';
import useModal from '#commonHooks/useModal.ts';
import { NetworkSettingModal } from '@modals/network-modal/NetworkSettingModal.tsx';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import { addEventListener, withBatchedUpdates } from '@utils/helper.ts';
import { EVENTS } from '@/app/constants/events.ts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';
import { OrderV2 } from '@modals/index.ts';
import { AxiosHttpService } from '@services/axiosHTTP.service.ts';
export const Navbar = lazy(() => import('../../components/navbar/Navbar.tsx'));
export const Sidebar = lazy(() => import('../../components/sidebar/Sidebar.tsx'));
export const ErrorConnection = lazy(() => import('../../components/modals/ErrorConnection.tsx'));

export const PanelPage = () => {
  const location = useLocation();
  const keyPress = useGlobalFastField('keyPress');
  const { showModal, setShowModal, setShowModalStr, showModalStr } = useModal();
  const { isAuth } = useUserData();
  const [sessionReady, setSessionReady] = useState(false);


  const modals = useMemo(
    () => ({
      isNetworkSettingModalOpen: showModal && showModalStr === MODAL_KEY_OPEN.NETWORK_SETTING,
      isErrorConnectionModalOpen: showModal && showModalStr === MODAL_KEY_OPEN.ERROR_CONNECTION,
    }),
    [showModal, showModalStr]
  );

  const closeErrorConnectionModal = useCallback(() => {
    setShowModal(false);
    localStorage.removeItem(MODAL_KEY_OPEN.ERROR_CONNECTION);
  }, [setShowModal]);

  useEffect(() => {

    const errorUnsubscribe = addEventListener(window, EVENTS.ERROR_STATE, e => {
      setShowModal(true);
      setShowModalStr(MODAL_KEY_OPEN.ERROR_CONNECTION);
    });
    AxiosHttpService.getInstance().updateUrlInstance();
    const keydownUnsubscribe = addEventListener(
      window,
      EVENTS.KEYDOWN,
      withBatchedUpdates(e => {
        if (e.ctrlKey && e.altKey && e.key === 'ñ') {
          setShowModal(true);
          setShowModalStr(MODAL_KEY_OPEN.NETWORK_SETTING);
          e.stopImmediatePropagation();
          e.stopPropagation();
          return;
        }
        if (e.key === 'Escape') {
          keyPress.set('Escape');
          e.preventDefault();
          e.stopImmediatePropagation();
          e.stopPropagation();
          return;
        }

        // No detenemos la propagación para otras teclas para permitir que lleguen a los inputs
      })
    );

    // Add delay to ensure session is fully established
    const checkSessionReady = () => {
      const loginTimestamp = localStorage.getItem('last_login_timestamp');
      const now = Date.now();
      const timeSinceLogin = loginTimestamp ? now - parseInt(loginTimestamp) : Infinity;

      // If login was recent (less than 2 seconds ago), wait a bit more
      if (timeSinceLogin < 2000) {
        setTimeout(() => {
          setSessionReady(true);
        }, 1500); // Increased to 1.5 seconds for more stability
      } else {
        setSessionReady(true);
      }
    };

    checkSessionReady();

    return () => {
      errorUnsubscribe();
      keydownUnsubscribe();
      localStorage.removeItem(MODAL_KEY_OPEN.ERROR_CONNECTION);
    };
  }, []);

  // Debug sessionReady changes
  useEffect(() => {
    console.log('🎯 PanelPage: sessionReady changed', {
      timestamp: new Date().toISOString(),
    });
  }, [sessionReady]);

  if (!isAuth) {
    return <Navigate to="/auth/signup" state={{ redirect: location.pathname }} />;
  }


  return (
    <>
      {modals.isNetworkSettingModalOpen && (
        <NetworkSettingModal
          isOpen={modals.isNetworkSettingModalOpen}
          close={() => setShowModal(false)}
        />
      )}

      {modals.isErrorConnectionModalOpen && (
        <Suspense fallback={null}>
          <ErrorConnection
            closeModal={closeErrorConnectionModal}
            open={modals.isErrorConnectionModalOpen}
          />
        </Suspense>
      )}

      {/* Render components that make API calls only when session is ready */}
      {sessionReady ? (
        <>
          <OrderV2 />
        </>
      ) : (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}>
          <div
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}>
            <div>Initializing session...</div>
            <Loader />
          </div>
        </div>
      )}

      <Sidebar />

      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </>
    // </FlashLightProvider>
  );
};

export default PanelPage;
