import { Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { Loader } from '@/app/views/components/loaders/Loader';
import {
  ConfirmationSignUp,
  SnsPanel,
  LeaksPanel,
} from '../views/pages';
import { PanelPage } from '../views/pages/panel/PanelPage';
import InxPanel from '../views/pages/panel/layouts/inx/InxPanel';
import { PasswordRecovery } from '../views/pages/auth/newLayouts/NewPasswordRecovery/PasswordRecoveryPage';
import { TermsAndCondition } from '../views/pages/help-center/TermsAndCondition';
import { HelpCenter } from '../views/pages/help-center/HelpCenter';
import { SecurityAndPrivacyPolicy } from '../views/pages/help-center/SecurityAndPrivacyPolicy';
import { HelpNotfound } from '../views/pages/help-center/HelpNotfound';
import ProtectedRoute from './ProtectedRoute';
import { NewAuthPage } from '@/app/views/pages/auth/NewAuthPage';
import { NewSignupForm } from '@/app/views/pages/auth/newLayouts/NewSignupForm/NewSignupForm';
import { NewSigninForm } from '@/app/views/pages/auth/newLayouts/NewSigninForm/NewSigninForm';
import { NewSignupInvitation } from '@/app/views/pages/auth/newLayouts/NewSignupInvitation/NewSignupInvitation';

export const AppRouter = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <PanelPage />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute isAllowed={true}>
              <LeaksPanel />
            </ProtectedRoute>
          ),
        },
        { path: 'leaks', element: <LeaksPanel /> },
        { path: 'inx', element: <InxPanel /> },
        { path: 'sns', element: <SnsPanel /> },
      ],
    },
    // Public routes
    {
      path: 'help/*',
      element: <HelpCenter />,
      children: [
        { path: 'terms-and-condition', element: <TermsAndCondition /> },
        { path: 'security-and-privacy-policy', element: <SecurityAndPrivacyPolicy /> },
        { path: '*', element: <HelpNotfound /> },
      ],
    },
    {
      path: 'auth/*',
      element: <NewAuthPage />,
      children: [
        { index: true, element: <Navigate to="signin" replace /> },
        { path: 'signup', element: <NewSignupForm /> },
        { path: 'signup/:ref', element: <NewSignupForm /> },
        { path: 'signin', element: <NewSigninForm /> },
        { path: 'signup/invitation', element: <NewSignupInvitation /> },
        { path: 'signup/invitation/:ref', element: <NewSignupInvitation /> },
        { path: 'confirmation', element: <ConfirmationSignUp /> },
        { path: 'recovery', element: <PasswordRecovery /> },
        { path: 'recovery/:ref', element: <PasswordRecovery /> },
      ],
    },
  ]);

  return <Suspense fallback={<Loader />}>{routes}</Suspense>;
};
