import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/history/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='grid size-full grid-cols-2 place-items-center-safe'>
      <div>left</div>
      <div>right</div>
    </div>
  );
}
