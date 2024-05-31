import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Components/Loader";
import { setCredentials } from "../../redux/features/authSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (user) {
      navigate('/home');
      console.log(user)
    }
  }, [navigate, user]);

  const submitHandler = async (val) => {
    val.preventDefault();
    

    if (!email.includes('@')) {
      toast.error('Invalid email address');
      return;
    }
    

    const data = {
      email,
      password: pwd,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/users/auth", data);
      const { _id, username, email, isAdmin, token } = response.data;
      dispatch(setCredentials({ _id, username, email, isAdmin}));
      Cookies.set('jwt',token)
      navigate('/home');
    } catch (e) {
      toast.error("Incorrect Email or Password");
    }

    setEmail('');
    setPwd('');
  };

  return (
    <section
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://wallpaperbat.com/img/333697-supermarket-wallpaper.jpg')`,
      }}
    >
      <div className="bg-gray-900 bg-opacity-75 p-10 rounded-lg">
        <h1 className="text-2xl font-semibold mb-4 text-white">Sign In</h1>

        <form onSubmit={submitHandler} className="w-80">
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
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded cursor-pointer my-4 w-full"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-4">
          <p className="text-white">
            New Customer?{" "}
            <Link
              to='/register'
              className="text-pink-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
