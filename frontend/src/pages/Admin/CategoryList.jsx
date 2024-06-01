import { useState, useEffect } from "react";
import { collapseToast, toast } from "react-toastify";
import axios from "axios";
import CategoryForm from "../../Components/CategoryForm";
import Cookies from "js-cookie";
import Modal from "../../Components/Modal";

const CategoryList = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/category/categories"
        );
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    fetchData();
  }, []);

  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const token = Cookies.get("jwt");
      const result = await axios.post(
        "http://localhost:5000/api/category/",
        { name },
        {
          headers: {
            Authorization: `${token}`, 
          },
        }
      );
      setName("");
      toast.success(`${result.data.name} is created`);
      setCategories([...categories, result.data]);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Category already exists");
      } else {
        toast.error("Creating category failed");
      }
    }
  };
  
  const SubmitUpdate=async(e)=>{
    e.preventDefault()
    if(!updateName){
        toast.error("Category nameis required");
        return;
    }
    try {
        const token = Cookies.get("jwt");
        const result = await axios.put(
          `http://localhost:5000/api/category/${selectCategory._id}`,
          { name: updateName },
          {
            headers: {
              Authorization: `${token}`, 
            },
          }
        );
        toast.success(`${result.data.name} is Updated`);
        setCategories(categories.map(val => val._id === selectCategory._id ? result.data : val));
        setSelectCategory(null);
        setUpdateName("");
        setModal(false);
    } catch (error) {
       
            toast.error("Updating category failed");
          
    }
  }

  const SubmitDelete=async(e)=>{
    e.preventDefault();
    try {
        const token = Cookies.get("jwt");
        const result = await axios.delete(
          `http://localhost:5000/api/category/${selectCategory._id}`,
          {
            headers: {
              Authorization: `${token}`, 
            },
          }
        );
        toast.success(`${selectCategory.name} is Deleted`);
        setSelectCategory(null);
        setModal(false);

    } catch (error) {
        toast.error("Deleting category failed");
    }

  }

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <div className="md:w-3/4 p-3">
        <div className="h-12">Manage Categories</div>
        <CategoryForm
          value={name}
          setvalue={setName}
          handleSubmit={SubmitHandler}
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                onClick={() => {
                  setModal(true);
                  setSelectCategory(category);
                  setUpdateName(category.name);
                }}
                className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500
                        hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        <Modal isOpen={modal} onClose={() => setModal(false)}>
          <CategoryForm
            value={updateName}
            setvalue={(value) => setUpdateName(value)}
            handleSubmit={SubmitUpdate}
            buttonText="Update"
            handleDelete={SubmitDelete}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
