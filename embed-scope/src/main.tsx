import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

const hashHistory = createHashHistory();

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  history: hashHistory,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
