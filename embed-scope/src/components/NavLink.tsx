import { Link } from '@tanstack/react-router';


export function NavLink(props: React.ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={`active:bg-overlay/40 pointer-events-auto rounded-full px-3 py-1 text-sm transition-colors duration-300 ${props.className ?? ''}`}
      activeProps={{
        className: 'bg-overlay text-accent',
      }}
      inactiveProps={{ className: 'text-overlay hover:bg-overlay/20' }}
    />
  );
}
