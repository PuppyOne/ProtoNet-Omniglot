import { NavLink } from './NavLink';


export default function NavLinks() {
  return (
    <>
      <NavLink to='/'>主页</NavLink>
      <NavLink to='/support'>字库</NavLink>
      <NavLink to='/query'>识别</NavLink>
      <NavLink to='/history'>历史</NavLink>
    </>
  );
}
