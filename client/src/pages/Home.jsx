import { useEffect, useState } from "react";

const Home=()=>{
    const [feed, setFeed] = useState([]);

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
            //console.log(response);
            if (response.status === true) {
                setFeed(response.userOnfeed);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchFeed();
    }, []);

    return (
        <div className="flex justify-center min-h-[90vh] items-center">
            <div className="card bg-base-100 w-96 shadow-xl">
                <figure>
                    <img
                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                    alt="Shoes" />
                </figure>

                <div className="card-body">
                    <h2 className="card-title">Shoes!</h2>
                    <p>If a dog chews shoes whose shoes does he choose?</p>
                    <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home