import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { AuthPage } from '@/pages/AuthPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { KycPage } from '@/pages/KycPage';
import { EducationHubPage } from '@/pages/EducationHubPage';
import { AdminPage } from '@/pages/AdminPage';
import { OrderTrackingPage } from '@/pages/OrderTrackingPage';
import { EducationDetailPage } from '@/pages/EducationDetailPage';
import { ProductEditPage } from '@/pages/ProductEditPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { RootLayout } from '@/components/layout/RootLayout';
import { App } from './App';
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/profile/listings/new",
        element: <ProductEditPage />,
      },
      {
        path: "/profile/listings/edit/:productId",
        element: <ProductEditPage />,
      },
      {
        path: "/kyc",
        element: <KycPage />,
      },
      {
        path: "/order/:orderId",
        element: <OrderTrackingPage />,
      },
      {
        path: "/education",
        element: <EducationHubPage />,
      },
      {
        path: "/education/:articleId",
        element: <EducationDetailPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
      {
        path: "/checkout",
        element: <CheckoutPage />,
      },
    ]
  }
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)