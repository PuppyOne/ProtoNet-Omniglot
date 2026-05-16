import { useTranslation } from 'react-i18next';

import LineMdCog from '~icons/line-md/cog';
import LineMdCogLoop from '~icons/line-md/cog-loop';
import LineMdHomeSimpleTwotone from '~icons/line-md/home-simple-twotone';
import LineMdImageTwotone from '~icons/line-md/image-twotone';
import LineMdSearchTwotone from '~icons/line-md/search-twotone';

import { NavLink } from './NavLink';


export default function NavLinks() {
  const { t } = useTranslation();

  return (
    <>
      <NavLink to='/'>
        {({ isActive }) => (
          <>
            <LineMdHomeSimpleTwotone key={+isActive} className='text-lg' />
            {t('nav.home')}
          </>
        )}
      </NavLink>

      <NavLink to='/support'>
        {({ isActive }) => (
          <>
            <LineMdImageTwotone key={+isActive} className='text-lg' />
            {t('nav.support')}
          </>
        )}
      </NavLink>

      <NavLink to='/model'>
        {({ isActive }) => (
          <>
            {isActive ? (
              <LineMdCogLoop className='text-lg' />
            ) : (
              <LineMdCog className='text-lg' />
            )}
            {t('nav.model')}
          </>
        )}
      </NavLink>

      <NavLink to='/query'>
        {({ isActive }) => (
          <>
            <LineMdSearchTwotone key={+isActive} className='text-lg' />
            {t('nav.query')}
          </>
        )}
      </NavLink>
    </>
  );
}
