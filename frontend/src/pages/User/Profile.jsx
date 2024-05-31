import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../redux/features/authSlice";


const Profile = () => {
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const dispatch=useDispatch();
  const user=useSelector((state)=>state.auth.user)
   if(user){
  const { username, email} = user;

  const submitHandler = async (eve) => {
    eve.preventDefault();
    if (pwd.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (pwd != confirmPwd) {
      toast.error("Password did not match");
      return;
    }
    const data = {
      username,
      email,
      password: pwd,
    };
    try {
      const token = Cookies.get("jwt");
      await axios.put("http://localhost:5000/api/users/profile", data, {
        headers: {
          Authorization: `${token}`,
        },
      });
      
      const updatedUserData = { ...user, username: data.username, email: data.email };
      dispatch(updateUser(updatedUserData));
      
       toast.success("Profile Updated Successfully");
        } 
        catch {(e) => {
        toast.error(e);
        return;
      };
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[10rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3">
          <h2 className="text-white text-2xl font-semibold mb-4">
            Update Profile
          </h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-white mb-2">Username</label>
              <input
                type="text"
                placeholder="Username"
                className="form-input p-4 rounded-sm w-full"
                value={username}
                onChange={(e) => dispatch(updateUser({ username: e.target.value }))}
              />
              <label className="block text-white mb-2">Email</label>
              <input
                type="email"
                placeholder="email"
                className="form-input p-4 rounded-sm w-full"
                value={email}
                onChange={(e) => dispatch(updateUser({ email: e.target.value }))}
              />
              <label className="block text-white mb-2">Password</label>
              <input
                type="password"
                placeholder="password"
                className="form-input p-4 rounded-sm w-full"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <label className="block text-white mb-2">Confirm Password</label>
              <input
                type="password"
                placeholder="confirm password"
                className="form-input p-4 rounded-sm w-full"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
              <button
                type="submit"
                className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-4 w-full"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );}
};

export default Profile;

