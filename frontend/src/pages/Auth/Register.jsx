import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Components/Loader";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import { setCredentials } from "../../redux/features/authSlice";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const {user}=useSelector((state)=>state.auth)
  
  useEffect(() => {
    if (Cookies.get("jwt")) {
      navigate('/home');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else {
     let data = {
        username,
        email,
        password,
      };
  
    console.log(data);

    await axios.post("http://localhost:5000/api/users/createUser", data)
    .then((res) => {
        let { _id, username, email, isAdmin} = res.data;
        Cookies.set('jwt', res.data.token);
        const data={ _id, username, email, isAdmin }
       localStorage.setItem('userData', JSON.stringify(data));
       dispatch(setCredentials(data))
        navigate('/home');
       
    }).catch((e)=>{
      console.log(e);
    })
    
    
      
    }
    };

  return (
    <section
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://getwallpapers.com/wallpaper/full/3/4/3/939541-wallpapers-for-laptop-background-1920x1200-for-ios.jpg')`,
      }}
    >
      <div className="bg-gray-900 bg-opacity-75 p-10 rounded-lg">
        <h1 className="text-2xl font-semibold mb-4 text-white">Register</h1>

        <form onSubmit={submitHandler} className="w-80">
          <div className="my-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter name"
              value={username}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="my-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="my-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-4 w-full"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-4">
          <p className="text-white">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );

};
export default Register;
