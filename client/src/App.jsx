import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "./redux/userSlice";
import toast from "react-hot-toast";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Premium from "./pages/Premium";

const AppLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const send = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/view`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const response = await send.json();
      // console.log(response);
      if (response.status === true) {
        
      } else {
        toast.error("Please login to continue!");
        dispatch(removeUser());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/premium",
        element: <Premium />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={appRouter} />;
};

export default App;
