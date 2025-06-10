import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { persistor, store } from '@/redux/store.ts'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { PersistGate } from 'redux-persist/integration/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layout/MainLayout.tsx'
import Home from '@/pages/home/Home.tsx'
import Login from './pages/login/Login.tsx'
import Register from './pages/register/Register.tsx'
import Project from './pages/project/Project.tsx'
import { SocketProvider } from './provider/SocketProvider.tsx'
import CreateProject from './pages/project/CreateProject.tsx'
import CanvasEditor from './pages/canvas-editor/CanvasEditor.tsx'

const router=createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/projects',
                element: <Project />,
            },
            {
                path: '/create-project',
                element: <CreateProject />,
            },
            {
                path: '/editor/:id',
                element: <CanvasEditor />,
            },
        ],
        errorElement: <div>404 Not Found</div>,
    }
    ,
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster />
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <RouterProvider router={router}></RouterProvider>
        </SocketProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
