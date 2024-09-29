import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home=()=>{
    
    const [feed, setFeed] = useState([]);
    const navigate=useNavigate();
    
    const userprofile=useSelector((state)=>state.user.profile);
    if(!userprofile){
        navigate("/login");
    }

    const fetchFeed = async () => {
        try {
            const send = await fetch(`${import.meta.env.VITE_BASE_URL}/user/feed`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const response = await send.json();
            //console.log(response.userOnfeed);
            if (response.status === true) {
                setFeed(response.userOnfeed);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleRequest = async (id, status) => {
        try {
            const send = await fetch(`${import.meta.env.VITE_BASE_URL}/request/send/${id}/${status}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const response = await send.json();
            //console.log(response);
            if (response.status === true) {
                toast.success(response.message);
                setFeed((prevFeed) => prevFeed.filter(item => item._id !== _id));
            } else {
                toast.error(response.message);
                console.log(response.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    useEffect(() => {
        fetchFeed();
    }, []);

    if(feed.length === 0) return <div className="flex justify-center min-h-[90vh] items-center text-2xl">No users found :( </div>

    //console.log(feed);
    const {profileurl, username, age, gender, about, skills, _id} = feed[0] || {};

    return (
        <div className="flex justify-center min-h-[90vh] items-center">
            <Toaster />
            <div className="flex justify-center min-h-[90vh] items-center">
                <div className="card bg-base-300 w-96 shadow-xl">
                    <figure>
                        <img
                            src={profileurl}
                            alt="Profile photo" 
                            className="rounded-lg w-full h-36 object-scale-down"
                        />
                    </figure>

                    <div className="card-body">
                        <h2 className="card-title">{username}</h2>
                        <p>{age}, {gender}</p>
                        <p>{about}</p>
                        <p className="font-semibold">Skills: <span className="font-normal">{skills}</span></p>
                        <div className="card-actions justify-center mt-5 gap-5">
                            <button className="btn btn-primary" onClick={()=>handleRequest(_id, "interested")}>Connect</button>
                            <button className="btn btn-primary" onClick={()=>handleRequest(_id, "notinterested")}>Ignore</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home