import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const PendingRequests = ({visible, setVisible}) => {

    const [pending, setPending] = useState([]);

    const handleModalClose = () => {
        setVisible(false);
    };

    const fetchPending=async()=>{
        try {
            const pending=await fetch(`${import.meta.env.VITE_BASE_URL}/user/requests/pending`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            const response=await pending.json();
            //console.log(response);
            if(response.status===true){
                setPending(response.requests);
            } else {
                toast.error(response.message);
                console.log(response.message);
            }
        } catch (error) {
            toast.error(response.message);
            console.log(error);
        }
    }

    const acceptOrReject=async(status, id)=>{
        try {
            //console.log(`${import.meta.env.VITE_BASE_URL}/request/receive/${status}/${id}`)
            const pending=await fetch(`${import.meta.env.VITE_BASE_URL}/request/receive/${status}/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({id, status})
            });
            const response=await pending.json();
            //console.log(response);
            if(response.status===true){
                toast.success(response.message);
                fetchPending();
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
        fetchPending();
    }, []);

    return (
        <div>
            <Toaster/>
            <dialog id="my_modal_1" className="modal" open={visible}>
                <div className="modal-box bg-base-200">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleModalClose}>✕</button>
                    </form>
                    
                    <div>
                        <h1 className="text-2xl font-bold text-center mb-5">Pending requests ({pending.length})</h1>
                        <div className="flex flex-col gap-4">
                            {pending.length===0 && <h1 className="text-center text-xl">No pending requests</h1>}
                            {pending.map((connection) => (
                                <div key={connection._id} className="bg-base-300 h-14 rounded-lg flex items-center justify-between">
                                    <div className="flex gap-2 items-center">
                                        <img src={connection.fromUser.profileurl} alt="profile" className="w-8 h-8 rounded-full mx-2"/>
                                        <h2>{connection.fromUser.username}</h2>
                                    </div>
                                    <div className="flex gap-2 mr-2">
                                        <button className="btn btn-sm btn-primary" onClick={()=>acceptOrReject("accepted", connection._id)}>Accept</button>
                                        <button className="btn btn-sm hover:btn-primary" onClick={()=>acceptOrReject("rejected", connection._id)}>Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default PendingRequests;