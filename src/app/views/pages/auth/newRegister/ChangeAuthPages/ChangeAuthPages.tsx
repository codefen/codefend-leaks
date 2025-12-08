import { Link } from 'react-router';
import css from './changeAuth.module.scss';

export const ChangeAuthPages = ({ pathname }: { pathname: string }) => {
  return (
    <div className={css['change-page-container']}>
      <Link to="/auth/signin" className={pathname === '/auth/signin' ? css['active-link'] : ''}>
        Access
      </Link>
      <Link
        to="/auth/signup"
        className={pathname.startsWith('/auth/signup') ? css['active-link'] : ''}>
        New user
      </Link>
    </div>
  );
};
