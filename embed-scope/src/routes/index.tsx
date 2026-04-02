import { Button } from '@heroui/react';
import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <>
      <h1>PyTauri App</h1>
      <Button>Hello Hero</Button>
    </>
  );
}
