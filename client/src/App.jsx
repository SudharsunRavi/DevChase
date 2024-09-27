import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"

import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"

const AppLayout=()=>{
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

const App=()=>{
  const appRouter=createBrowserRouter([
    {
      path:"/",
      element:<AppLayout/>,
      children:[
        {
          path:"/",
          element:<Home/>
        },
        {
          path:"/login",
          element:<Login/>
        },
      ],
    }
  ])

  return <RouterProvider router={appRouter} />;
}

export default App
