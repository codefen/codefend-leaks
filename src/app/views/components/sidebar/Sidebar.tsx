import { useState } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { SidebarDesktop } from '@/app/views/components/sidebar/SidebarDesktop';
import { useMediaQuery } from 'usehooks-ts';
import { SidebarMobile } from '@/app/views/components/sidebar/SidebarMobile';
import { SidebarOpenButton } from '@/app/views/components/sidebar/SidebarOpenButton';
import { useSwipeToOpen } from '@/app/views/components/sidebar/useSwipeToOpen';
import './sidebar-consolidated.scss';

export const verifyPath = (verifyPath: string, isRoot: boolean) => {
  const currentPath = window.location.pathname;

  if (isRoot) {
    return currentPath === verifyPath;
  }

  // Para rutas no raíz, comparamos la ruta completa para evitar coincidencias parciales
  return currentPath === verifyPath || currentPath.startsWith(verifyPath + '/');
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { getUserdata, company, isAuth } = useUserData();
  const matches = useMediaQuery('(min-width: 1230px)');
  
  // Hide sidebar on /leaks page
  const currentPath = window.location.pathname;
  const isLeaksPage = currentPath === '/leaks' || currentPath === '/';

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Hook para detectar swipe desde la izquierda y derecha
  useSwipeToOpen({
    minSwipeDistance: 50,
    maxSwipeTime: 300,
    onSwipeOpen: () => {
      if (!isOpen) {
        setIsOpen(true);
      }
    },
    onSwipeClose: () => {
      if (isOpen) {
        setIsOpen(false);
      }
    },
    isMobile: !matches, // Usar el mismo valor que determina si es móvil
    isOpen: isOpen,
  });

  // Don't render sidebar on leaks page
  if (isLeaksPage) {
    return null;
  }

  return (
    <aside
      className={`sidebar ${matches ? 'desktop-active' : 'mobile-active'} ${isOpen ? 'sidebar-open' : ''}`}>
      <SidebarOpenButton isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`sidebar-blur ${isOpen ? 'blur-enter animate-overlay-in' : ''}`}
        onDoubleClick={closeSidebar}></div>
      {matches ? (
        <SidebarDesktop isAuth={isAuth} />
      ) : (
        <SidebarMobile
          isOpen={isOpen}
          closeSidebar={closeSidebar}
          email={getUserdata()?.email || 'example@gmail.com'}
          companyName={company.get?.name || 'Codefend'}
        />
      )}
    </aside>
  );
};

export default Sidebar;
