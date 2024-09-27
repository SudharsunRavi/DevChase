import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";

const Navbar = () => {

    const userprofile=useSelector((state)=>state.user.profile);
    const dispatch=useDispatch();

    const handleLogout=async()=>{
        try {
            const logout=await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            dispatch(setUser(null));
        } catch (error) {
            toast.error(error);
        }
    }

    return (
        <div className="navbar bg-base-300">
            <Toaster/>
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">DevChase</a>
            </div>
            <div className="flex-none gap-2 mr-10">
                <div className="form-control">
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto h-12" />
                </div>
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
                        <li><a className="justify-between">Profile</a></li>
                        <li><a>Settings</a></li>
                        <li><a onClick={handleLogout}>Logout</a></li>
                    </ul>
                </div>) : (<a href="/login" className="btn btn-ghost">Login</a>)}
            </div>
            </div>
    )
};

export default Navbar;