import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";

const Signup= () => {

    const dispatch=useDispatch();
    const userData=useSelector((state)=>state.user.profile)
    //console.log(userData)

    const [formData, setFormData]=useState({
        username: userData.username,
        email: userData.email,
        age: userData.age,
        gender: userData.gender,
        skills: userData.skills,
        about: userData.about
    });

    const handleChange=(e)=>{
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const send = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const response = await send.json();
            console.log(response);
            if (response.status === true) {
                toast.success(response.message);
                dispatch(setUser(response.data));
            } else {
                toast.error(response.message);
                console.log(response.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    return(
        <div className="flex justify-center items-center">
            <Toaster/>
            <div className="card bg-base-300 w-96 mt-10">
                <div className="card-body flex justify-center">
                    <h2 className="card-title justify-center mb-5">Edit Profile</h2>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Username</span>
                            </div>
                            <input type="text" placeholder="Username" id="username" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.username} />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Email</span>
                            </div>
                            <input type="text" placeholder="Email" id="email" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.email}/>
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Age</span>
                            </div>
                            <input type="text" placeholder="Age" id="age" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.age}/>
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Gender</span>
                            </div>
                            {/* <input type="text" placeholder="Male / Female / Other" id="gender" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.gender}/> */}
                            <select id="gender" onChange={handleChange} defaultValue={formData.gender} className="input input-bordered w-full max-w-xs">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Skills</span>
                            </div>
                            <input type="text" placeholder="Skills" id="skills" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.skills}/>
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">About</span>
                            </div>
                            <textarea type="text" placeholder="About" id="about" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.about}/>
                        </label>

                        <div className="card-actions justify-center">
                            <button className="btn btn-primary">SAVE</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Signup;