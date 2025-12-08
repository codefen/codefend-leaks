import { useUserData } from '#commonUserHooks/useUserData';
import { ThemeChangerButton } from '@buttons/index';
import { LogoutIcon } from '@icons';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { verifyPath } from '@/app/views/components/sidebar/Sidebar';

// Simplified sidebar data - Unified Leaks, INX and SNS
const createSidebarData = () => {
  return [
    { title: 'Unified Leaks', path: '/leaks', root: true },
    { title: 'Intelligence Search', path: '/inx', root: false },
    { title: 'Dataleaks Explorer', path: '/sns', root: false },
  ];
};

// Función para determinar qué item debe estar activo
const getActiveItem = (
  sidebarItems: Array<{ title: string; path: string; root: boolean }>
): string | null => {
  for (const item of sidebarItems) {
    if (verifyPath(item.path, item.root)) {
      return item.title;
    }
  }
  return null;
};

export const SidebarMobile = ({
  isOpen,
  closeSidebar,
  email,
  companyName,
}: {
  isOpen: boolean;
  closeSidebar: () => void;
  email: string;
  companyName: string;
}) => {
  // Memoizar sidebarData para evitar recreación constante
  const sidebarData = useMemo(() => createSidebarData(), []);

  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const navigate = useNavigate();
  const { logout } = useUserData();

  // Solo inicializar el item activo cuando se abre el sidebar por primera vez
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      const newActiveItem = getActiveItem(sidebarData);
      setActiveItem(newActiveItem);
      setHasInitialized(true);
    }

    // Reset cuando se cierra el sidebar
    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen, sidebarData, hasInitialized]);

  // Mostrar contenido cuando el sidebar está abierto
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setContentVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
  }, [isOpen]);

  return (
    <div className={`sidebar-mobile ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-mobile-header">
        <div className={`sidebar-header-title ${contentVisible ? 'visible' : ''}`}>
          <h3>Navigation</h3>
        </div>
      </div>

      <div className="sidebar-mobile-content">
        <div className={`sidebar-content-container ${contentVisible ? 'visible' : ''}`}>
          <div className="sidebar-content-items">
            {sidebarData.map(item => (
              <button
                key={item.title}
                className={`menu-item no-border ${activeItem === item.title ? 'active' : ''}`}
                onClick={() => {
                  closeSidebar();
                  navigate(item.path);
                  setActiveItem(item.title);
                }}>
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sidebar-mobile-footer">
        <div className={`sidebar-footer-content ${contentVisible ? 'visible' : ''}`}>
          <div className="sidebar-footer-content-container">
            <div className="sidebar-footer-user">
              <span className="user-email">{email}</span>
              <span className="user-company">{companyName}</span>
            </div>
            <div className="sidebar-footer-actions">
              <ThemeChangerButton className="sidebar-footer-theme-changer" text="Theme" />
              <button className="no-border no-outline sidebar-footer-logout" onClick={logout}>
                <LogoutIcon width={1.1} height={1.1} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
