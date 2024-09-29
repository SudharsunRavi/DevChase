import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const MyConnections = ({ visible, setVisible }) => {
    
    const [connections, setConnections] = useState([]);

    const handleModalClose = () => {
        setVisible(false);
    };

    const fetchConnections=async()=>{
        try {
            const connections=await fetch(`${import.meta.env.VITE_BASE_URL}/user/connections`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            const response=await connections.json();
            //console.log(response);
            if(response.status===true){
                setConnections(response.neededData);
            } else {
                toast.error(response.message);
                console.log(response.message);
            }
        } catch (error) {
            toast.error(response.message);
            console.log(error);
        }
    }

    useEffect(() => {
        fetchConnections();
    }, []);

    return (
        <div>
            <Toaster/>
            <dialog id="my_modal_2" className="modal" open={visible}>
                <div className="modal-box bg-base-200">
                    <form method="dialog">
                        <button onClick={handleModalClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    
                    <div>
                        <h1 className="text-2xl font-bold text-center mb-5">My Connections ({connections.length})</h1>
                        <div className="flex flex-col gap-4">
                            {connections.length===0 && <h1 className="text-center">No connections yet!</h1>}
                            {connections.map((connection) => (
                                <div key={connection._id} className="bg-base-300 h-14 rounded-lg flex items-center gap-1">
                                    <img src={connection.profileurl} alt="profile" className="w-8 h-8 rounded-full mx-2"/>
                                    <h2 className="">{connection.username}</h2>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default MyConnections;
