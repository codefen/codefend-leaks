import { lazy } from 'react';

export const ConfirmationSignUp = lazy(() => import('./auth/layouts/ConfirmationSignUp'));

// Core modules - INX, SNS, and unified Leaks
export const InxPanel = lazy(() => import('./panel/layouts/inx/InxPanel.tsx'));
export const SnsPanel = lazy(() => import('./panel/layouts/sns/SnsPanel.tsx'));
export const LeaksPanel = lazy(() => import('./panel/layouts/leaks/LeaksPanel.tsx'));
