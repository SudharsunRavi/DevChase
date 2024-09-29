import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import UserCard from "../components/UserCard";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

const Profile= () => {

    const dispatch=useDispatch();
    const userData=useSelector((state)=>state.user.profile)
    //console.log(userData)

    const photoRef = useRef(null);
    const [photo, setPhoto] = useState(undefined);
    const [uploadedPercentage, setUploadedPercentage] = useState(0);

    const [formData, setFormData]=useState({
        username: userData.username,
        email: userData.email,
        age: userData.age,
        gender: userData.gender,
        skills: userData.skills,
        about: userData.about,
        profileurl: userData.profileurl || ''
    });

    const handleChange=(e)=>{
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    const handlePhotoUpload = (photo) => {
        if (!photo) {
            setUploadError("No photo selected");
            return;
        }
    
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "_" + photo?.username;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, photo);
    
        toast.promise(
            new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadedPercentage(Math.round(progress));
                    },
                    (error) => {
                        reject(error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref)
                            .then((downloadURL) => {
                                setFormData({ ...formData, profileurl: downloadURL });
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    }
                );
            }),
            {
                loading: "Uploading...",
                success: "Upload completed!",
                error: "Upload failed.",
            }
        );
    };    

    useEffect(() => {
        if (photo) {
            handlePhotoUpload(photo);
        }
    }, [photo]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
        }
    };

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
            //console.log(response);
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
        <div className="flex justify-center">
            <Toaster/>
            <div className="card bg-base-300 w-96 mt-10">
                <div className="card-body flex justify-center">
                    <div className="flex justify-between">
                        <h2 className="card-title justify-center mb-5">Edit Profile</h2>
                        <h2 className="justify-center mb-5 text-primary underline cursor-pointer" onClick={()=>document.getElementById('my_modal_3').showModal()}>Preview</h2>
                        
                        <dialog id="my_modal_3" className="modal">
                            <div className="modal-box overflow-hidden">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <UserCard data={formData}/>
                            </div>
                        </dialog>
                    </div>
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

                        <div className="flex gap-4">
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
                        </div>

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

                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Profile photo: (jpeg / jpg / png)</span>
                            </div>
                            <input type="file" className="file-input file-input-bordered w-full max-w-xs" accept="image/*" id="photo" ref={photoRef} onChange={handleFileChange}/>
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

export default Profile;