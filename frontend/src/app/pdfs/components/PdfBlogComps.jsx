import axios from "axios";
import Link from "next/link";
import { MdOutlineAccessTimeFilled, MdOutlineDelete } from "react-icons/md";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import { motion } from "framer-motion";

function BlogComps({
  date,
  title,
  updatedDate,
  id,
  status,
  category,
  userData,
  price,
  onDeleteSuccess,
}) {
  let role;

  if (userData) {
    if (userData.role === "admin") {
      role = true;
    } else {
      role = false;
    }
  } else {
    role = false;
  }

  const handleDeleteClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.confirm("Are you sure you want to delete this item?")) {
      const token = localStorage.getItem("jwt_token");
      let loadingToast;
      try {
        loadingToast = toast.loading("Deleting PDF...");
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/pdfs/${id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.status === 200) {
          toast.dismiss(loadingToast);
          toast.success("Item deleted successfully");
          onDeleteSuccess();
        } else {
          toast.dismiss(loadingToast);
          console.error("Error deleting item:", response);
          toast.error("Error in deleting item");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Error deleting item:", error);
        toast.error("Error in deleting item");
      }
    }
  };

  const decodeHtmlEntities = (html) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };

  return (
    <motion.div
      className="border border-2 bg-white p-4 rounded-xl shadow-lg transition duration-500 relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {role && (
        <button
          className="absolute top-0 right-0 text-red-600 cursor-pointer bg-red-500 rounded-full p-2 z-10"
          onClick={handleDeleteClick}
        >
          <MdOutlineDelete size={32} color="#fff" />
        </button>
      )}
      <Link href={`/pdfs/${id}`} className="w-full h-full">
        <div className="card__header">
          <div className="card__picture relative">
            <div className="card__picture-overlay  absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">&nbsp;</div>
            <div className="relative">
              <Image
                width={500}
                height={500}
                className="w-full rounded-xl"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGE}/img/affairs/uchiudan.png`}
                alt="Blog Cover"
              />
              {/* <p className="absolute top-0 bg-[#ffef39] text-gray-800 font-semibold py-1 px-3 rounded-br-lg rounded-tl-lg">
                {date}
              </p> */}
            </div>
          </div>
          <h3 className="heading-tertirary">
            <span>{category}</span>
          </h3>
        </div>
        <h1 className="mt-4 text-gray-800 text-lg font-bold cursor-pointer overflow-hidden mb-4 truncate h-[30px]">
          <span
            dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(title) }}
          />
        </h1>
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-800 text-lg font-bold border border-slate-800 rounded-md p-1 shadow-xl bg-slate-100">
            Status:{" "}
            <span
              className={`${
                status === "free" ? "text-green-500" : "text-red-500"
              } font-bold ml-2`}
            >
              {status}
            </span>
          </div>
          <div className="text-gray-800 text-lg font-bold border border-slate-800 rounded-md p-1 shadow-xl bg-slate-100">
            Price:{" "}
            <span
              className={`${
                status === "free" ? "text-green-500" : "text-red-500"
              } font-bold ml-2`}
            >
              {status === "free" ? "₹0" : `₹${price}`}
            </span>
          </div>
        </div>
        
          {/* <motion.div
            className="absolute top-2 left-0 text-white bg-red-500 rounded-full p-2 z-10"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-bold">Limited Time Offer!</span>
          </motion.div> */}
      
        <button className="mt-4 text-md hover:bg-indigo-600 w-full text-white bg-indigo-400 py-1 px-3 rounded-xl hover:shadow-xl">
          Read More
        </button>
      </Link>
      <Toaster position="top-center" reverseOrder={false} />
    </motion.div>
  );
}

export default BlogComps;
