import { Surface } from '@heroui/react';


export default function Section(props: React.ComponentProps<typeof Surface>) {
  return (
    <Surface
      {...props}
      className={`size-full rounded-3xl ${props.className ?? ''}`}
     />
  );
}
