import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../redux/userSlice";
import MyConnections from "./MyConnections";
import { useState } from "react";
import PendingRequests from "./PendingRequests";
import { useNavigate } from "react-router-dom";

const Navbar = () => {

    const userprofile=useSelector((state)=>state.user.profile);
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const [isConnectionsVisible, setConnectionsVisible] = useState(false);
    const [isPendingConnectionsVisible, setPendingConnectionsVisible] = useState(false);

    const handleLogout=async()=>{
        try {
            const logout=await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            navigate("/login");
            dispatch(removeUser());
        } catch (error) {
            toast.error(error);
        }
    }

    const handleConnections = () => {
        setConnectionsVisible(true);
    };

    const handlePendingConnections = () => {
        setPendingConnectionsVisible(true);
    };

    return (
        <div className="navbar bg-base-300">
            <Toaster/>
            <div className="flex-1">
                <a className="btn btn-ghost text-xl" href="/">DevChase</a>
            </div>
        
            <div className="flex-none gap-2 mr-10">
                {userprofile ? (<div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS Navbar component"
                            src={userprofile?.profileurl} />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><a href="/premium">Buy Premium</a></li>
                        <li><a href="/profile">Profile</a></li>
                        <li><a onClick={handleConnections}>Connections</a></li>
                        <li><a onClick={handlePendingConnections}>Pending Connections</a></li>
                        <li><a onClick={handleLogout}>Logout</a></li>
                    </ul>
                </div>) : (<a href="/login" className="btn btn-ghost">Login</a>)}
            </div>
            
            <MyConnections visible={isConnectionsVisible} setVisible={setConnectionsVisible} />
            <PendingRequests visible={isPendingConnectionsVisible} setVisible={setPendingConnectionsVisible} />
        </div>
    )
};

export default Navbar;