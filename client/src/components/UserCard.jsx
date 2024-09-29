import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const UserCard=({data})=>{
    //console.log(data);
    const store=useSelector((state)=>state.user.profile);

    const [formData, setFormData]=useState({
        username: data.username,
        email: data.email,
        age: data.age,
        gender: data.gender,
        skills: data.skills,
        about: data.about,
        profileurl: data.profileurl || store.profileurl
    });

    return (
        <div className="flex justify-center min-h-[90vh] items-center">
            <div className="card bg-base-300 w-96 shadow-xl">
                <figure>
                    <img
                        src={formData?.profileurl}
                        alt="Profile photo"
                        className="rounded-lg w-full h-36 object-scale-down"
                    />
                </figure>

                <div className="card-body">
                    <h2 className="card-title">{formData?.username}</h2>
                    <p>{formData.age}, {formData.gender}</p>
                    <p>{formData.about}</p>
                    <p className="font-semibold">Skills: <span className="font-normal">{formData.skills}</span></p>
                    <div className="card-actions justify-center mt-5 gap-5">
                        <button className="btn btn-primary">Connect</button>
                        <button className="btn btn-primary">Ignore</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard