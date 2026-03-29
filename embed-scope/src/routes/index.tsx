import { Button } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';

import pyloidLogo from '@/assets/pyloid_icon.png';


export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <>
      <div>
        <img src={pyloidLogo} className='logo pyloid' alt='Pyloid logo' />
      </div>
      <h1>Pyloid App</h1>
      <Button>Hello Hero</Button>
    </>
  );
}
