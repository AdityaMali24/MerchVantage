import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import EditPage from './pages/EditCategoryPage';
import CategoryPage from './pages/CategoryPage';
import SubCategoryPage from './pages/SubCategoryPage';
import EditSubCategoryPage from './pages/EditSubCategoryPage';
import AddCategoryPage from './pages/AddCategoryPage';
import AddSubCategoryPage from './pages/AddSubCategoryPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'category', element: <CategoryPage /> },
        { path: 'subcategory', element: <SubCategoryPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'add-product', element: <AddProductPage /> },
        { path: 'products/edit/:product_id', element: <EditProductPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'category/edit/:category_id', element: <EditPage /> },
        { path: 'add-category', element: <AddCategoryPage /> },
        { path: 'subcategory/edit/:subcategory_id', element: <EditSubCategoryPage /> },
        { path: 'add-sub-category', element: <AddSubCategoryPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
