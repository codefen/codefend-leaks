import { useShowScreen } from '#commonHooks/useShowScreen';
import { Navigate, Outlet } from 'react-router';
import { Suspense } from 'react';
import { useUserData } from '#commonUserHooks/useUserData';
import { MoonIcon, SunIcon } from '@/app/views/components';

import { useTheme } from '@/app/views/context/ThemeContext';
import Show from '@/app/views/components/Show/Show';

export const NewAuthPage = () => {
  const [showScreen] = useShowScreen();
  const { isAuth } = useUserData();
  const { changeTheme, theme } = useTheme();

  if (isAuth) {
    return <Navigate to={'/'} />;
  }
  return (
    <main className={`auth-pages ${showScreen ? 'actived' : ''}`}>
      <button onClick={() => changeTheme()} className="theme-changer-button">
        <Show when={theme === 'dark'} fallback={<SunIcon width={1.75} height={1.75} />}>
          <MoonIcon width={1.75} height={1.75} />
        </Show>
      </button>
      <Suspense>
        <Outlet />
      </Suspense>
    </main>
  );
};
