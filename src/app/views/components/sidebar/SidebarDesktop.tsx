import { useCallback, lazy } from 'react';
import { LogoutIcon, RobotFaceIcon, DataleakSearchIcon, SunIcon, MoonIcon } from '@icons';
import Show from '@/app/views/components/Show/Show.tsx';
import ModalWrapper from '@modals/modalwrapper/ModalWrapper.tsx';
import { NetworkSettingModal } from '@modals/network-modal/NetworkSettingModal.tsx';
import useModal from '#commonHooks/useModal.ts';
import { useUserData } from '#commonUserHooks/useUserData';
import { MODAL_KEY_OPEN } from '@/app/constants/app-texts.ts';
import useModalStore from '@stores/modal.store.ts';
import { useGlobalFastField } from '@/app/views/context/AppContextProvider.tsx';
import ConfirmModal from '@modals/ConfirmModal.tsx';
import { useTheme } from '@/app/views/context/ThemeContext';
import { SidebarItem } from '@/app/views/components/sidebar/SidebarItem';
import { useUserRole } from '#commonUserHooks/useUserRole';
import { verifyPath } from '@/app/views/components/sidebar/Sidebar';

const Logo = lazy(() => import('../Logo/Logo.tsx'));

export const SidebarDesktop = ({ isAuth }: { isAuth: boolean }) => {
  const { logout } = useUserData();
  const { isAdmin } = useUserRole();
  const isOpenNetworkSetting = useGlobalFastField('isOpenNetworkSetting');
  const { showModal, showModalStr, setShowModal, setShowModalStr } = useModal();
  const { setIsOpen, setModalId } = useModalStore();
  const { theme, changeTheme } = useTheme();

  const openGuide = () => {
    setModalId(MODAL_KEY_OPEN.USER_WELCOME);
    setIsOpen(true);
  };

  // Simplified menu - Unified Leaks, INX and SNS modules
  const newMenuItems = [
    {
      title: 'Unified Leaks',
      id: 'sidebar_leaks',
      icon: <RobotFaceIcon width={1} height={1} />,
      to: '/leaks',
      root: true,
      haveAccess: true,
    },
    {
      title: 'Intelligence Search',
      id: 'sidebar_inx',
      icon: <RobotFaceIcon width={1} height={1} />,
      to: '/inx',
      root: false,
      haveAccess: true,
    },
    {
      title: 'Dataleaks Explorer',
      id: 'sidebar_sns',
      icon: <DataleakSearchIcon />,
      to: '/sns',
      root: false,
      haveAccess: true,
    },
  ];

  const getItems = useCallback(
    (menu: any[]) => {
      return menu
        .filter(entry => entry.haveAccess)
        .map(({ id, title, icon, to, root }) => (
          <SidebarItem
            key={`sb-${id}`}
            id={id}
            title={title}
            icon={icon}
            to={to}
            isActive={verifyPath(to, root)}
            isAuth={isAuth}
          />
        ));
    },
    [isAuth]
  );

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
      {isAdmin() && (
        <NetworkSettingModal
          close={() => isOpenNetworkSetting.set(!isOpenNetworkSetting.get)}
          isOpen={isOpenNetworkSetting.get}
        />
      )}
      {/* LOGO Y TEXTO ARRIBA DE TODO */}
      <div className="sidebar-logo-block" onClick={openGuide}>
        <span className="aim-logo">
          <Logo theme="aimColor" />
        </span>
        <span className="sidebar-logo-title">codefend</span>
      </div>
      {/* NAVIGATION ITEMS */}
      {getItems(newMenuItems)}
      
      {/* DIVIDER */}
      <hr style={{ margin: '18px 0 10px 0', border: 0, borderTop: '1px solid var(--border-color, #e0e0e0)' }} />
      
      {/* ACTIONS: Theme & Logout */}
      <div className="sidebar-group">
        <SidebarItem
          id="sidebar_action_theme"
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          icon={
            theme === 'light' ? <MoonIcon width={1} height={1} /> : <SunIcon width={1} height={1} />
          }
          to="#"
          isActive={false}
          isAuth={isAuth}
          onClick={changeTheme}
        />
        <SidebarItem
          id="sidebar_action_logout"
          title="Close session"
          icon={<LogoutIcon width={1} height={1} />}
          to="#"
          isActive={false}
          isAuth={isAuth}
          onClick={() => {
            setShowModalStr(MODAL_KEY_OPEN.LOGOUT);
            setShowModal(true);
          }}
        />
      </div>
    </>
  );
};
