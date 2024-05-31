import { useEffect, useState } from "react";
import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../Components/Message";
import Loader from "../../Components/Loader";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("jwt");
        const { data } = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUsers(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        const token = Cookies.get("jwt");
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <table className="w-full md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-white text-left">ID</th>
                <th className="px-4 py-2 text-white text-left">NAME</th>
                <th className="px-4 py-2 text-white text-left">EMAIL</th>
                <th className="px-4 py-2 text-white text-left">ADMIN</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 text-white">{user._id}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center text-white">
                      {user.username}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center text-white">
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {!user.isAdmin && (
                      <div className="flex">
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
