import LineMdCogFilled from '~icons/line-md/cog-filled';
import LineMdHomeSimpleTwotone from '~icons/line-md/home-simple-twotone';
import LineMdImageTwotone from '~icons/line-md/image-twotone';
import LineMdSearchTwotone from '~icons/line-md/search-twotone';

import { NavLink } from './NavLink';


export default function NavLinks() {
  return (
    <>
      <NavLink to='/'>
        <LineMdHomeSimpleTwotone className='text-lg' />
        主页
      </NavLink>

      <NavLink to='/support'>
        <LineMdImageTwotone className='text-lg' />
        字库
      </NavLink>

      <NavLink to='/model'>
        <LineMdCogFilled className='text-lg' />
        模型
      </NavLink>

      <NavLink to='/query'>
        <LineMdSearchTwotone className='text-lg' />
        识别
      </NavLink>
    </>
  );
}
