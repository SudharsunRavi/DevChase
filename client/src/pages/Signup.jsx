import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Signup= () => {

    const [confirmPassword, setConfirmPassword] = useState('');
    const [formData, setFormData]=useState({
        username: '',
        email: '',
        age: null,
        gender: '',
        skills: '',
        about: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange=(e)=>{
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            if (formData.password !== confirmPassword) {
                return toast.error("Passwords do not match!");
            }

            const send = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const response = await send.json();
            //console.log(response);
            if (response.status === true) {
                toast.success(response.message);
                navigate("/login");
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return(
        <div className="flex justify-center items-center">
            <Toaster/>
            <div className="card bg-base-300 w-96 mt-10">
                <div className="card-body flex justify-center">
                    <h2 className="card-title justify-center mb-5">Register</h2>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Username</span>
                            </div>
                            <input type="text" placeholder="Username" id="username" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.username} required />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Email</span>
                            </div>
                            <input type="text" placeholder="Email" id="email" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.email} required/>
                        </label>

                        <div className="flex gap-4">
                            <label className="form-control w-[80%] max-w-xs">
                                <div className="label">
                                    <span className="label-text">Age</span>
                                </div>
                                <input type="text" placeholder="Age" id="age" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.age} required/>
                            </label>

                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Gender</span>
                                </div>
                                {/* <input type="text" placeholder="Male / Female / Other" id="gender" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.gender}/> */}
                                <select id="gender" onChange={handleChange} defaultValue={formData.gender} className="input input-bordered w-full max-w-xs" required>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </label>
                        </div>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Skills</span>
                            </div>
                            <input type="text" placeholder="Skills" id="skills" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.skills} required/>
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">About</span>
                            </div>
                            <textarea type="text" placeholder="About" id="about" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.about} required/>
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Password</span>
                            </div>
                            <input type="password" placeholder="Password" className="input input-bordered w-full max-w-xs" onChange={(e)=>setConfirmPassword(e.target.value)} required />
                        </label>

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Confirm Password</span>
                            </div>
                            <input type="password" placeholder="Confirm password" id="password" className="input input-bordered w-full max-w-xs" onChange={handleChange} defaultValue={formData.password} required/>
                        </label>

                        <div className="card-actions justify-center">
                            <button className="btn btn-primary">Signup</button>
                        </div>
                    </form>
                <p className="mt-3">Existing user? <Link to='/login' className="underline">Login</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Signup;