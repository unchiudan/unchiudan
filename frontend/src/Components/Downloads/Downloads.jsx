/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdOutlineAccessTimeFilled, MdOutlineDelete } from "react-icons/md";
import { RiMenu3Fill, RiCloseFill } from "react-icons/ri";
import Sidebar_pdf from "../Sidebar/Sidebar_pdf"

function BlogComps({
  date,
  title,
  imageSrc,
  updatedDate,
  id,
  status,
  category,
}) {
  const handleDeleteClick = async (event) => {
    event.stopPropagation(); // Prevent the click event from propagating to the parent link element
    if (window.confirm("Are you sure you want to delete this item?")) {
      // Perform the delete action here, e.g., call an API to delete the item
      // You may want to pass the `id` or some identifier to delete the specific item
      // Example: deleteItem(id);
      const token = localStorage.getItem("jwt_token");
      console.log("🚀 ~ file: FormPDF.jsx:9 ~ postpdf ~ token:", token);
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/pdfs/${id}`,
          // `http://localhost:3000/api/pdfs/${id}`,
          {
            headers: {
              //   "Content-Type": "application/json",
              Authorization: token, // Replace YOUR_AUTH_TOKEN_HERE with the actual token
            },
          }
        );

        if (response.status === 200) {
          // The item was deleted successfully
          // Perform any additional actions you need here
          console.log("Item deleted successfully");
        } else {
          console.error("Error deleting item:", response);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };
  return (
    
      <div className="border border-2 bg-white p-4 rounded-xl shadow-lg transition duration-500 relative">
       
        <button
          className="absolute top-0 right-0 text-red-600 cursor-pointer bg-red-500 rounded-full p-2"
          style={{ zIndex: 1 }} // Increase the z-index value
          onClick={handleDeleteClick}
        >
          <MdOutlineDelete size={32} color="#fff" />
        </button>
        <Link to={`/pdfs/${id}`} className="w-full h-full">
        <div className="card__header">
          <div className="card__picture">
            <div className="card__picture-overlay">&nbsp;</div>
            <div className="relative">
              <img
                className="w-full rounded-xl"
                src={imageSrc}
                alt="Blog Cover"
              />
              <p className="absolute top-0 bg-[#ffef39] text-gray-800 font-semibold py-1 px-3 rounded-br-lg rounded-tl-lg">
                {date}
              </p>
            </div>
          </div>
          <h3 className="heading-tertirary">
            <span>{category}</span>
          </h3>
        </div>
        <h1 className="mt-4 text-gray-800 text-lg font-bold cursor-pointer overflow-hidden mb-[1rem]">
          {title}
        </h1>
        <h1 className="mt-4 text-gray-800 text-lg font-bold cursor-pointer">
          status: {status}
        </h1>
        <div className="card__data">
          <h1 className="text-gray-800 text-lg font-bold cursor-pointer overflow-hidden">
            <MdOutlineAccessTimeFilled className="card__icon" />
          </h1>
          <p className="text-lg ">updated at: {updatedDate}</p>
        </div>
        <div className="my-2 mx-6 flex justify-between"></div>
        <button className="mt-4 text-md hover-bg-indigo-600 w-full text-white bg-indigo-400 py-1 px-3 rounded-xl hover:shadow-xl">
          Read More
        </button>
        </Link>
      </div>
    
  );
}

function Downloads() {
  const [pdfs, setPdfs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filter, setFilter] = useState(false);
  const isSmallScreen = window.innerWidth <= 680;
  const togglefilter = () => {
    setFilter(!filter);
  };

  useEffect(() => {
    let apiUrl = `${import.meta.env.VITE_BACKEND_URL}/pdfs`;

    if (selectedCategory !== null) {
      apiUrl += `/?category=${selectedCategory}`;
    }

    if (selectedStatus !== null) {
      apiUrl += `${selectedCategory ? "&" : "/?"}status=${selectedStatus}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        setPdfs(response.data.data.pdf);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedCategory, selectedStatus]);

  return (
    <div className="mx-auto py-[7rem]">
      <div className="p-2">
        {isSmallScreen && (
          <button
            onClick={togglefilter}
            className="text-black hover:text-gray-300 focus:outline-none md:hidden"
          >
            {filter ? (
              <RiCloseFill className="text-2xl" />
            ) : (
              <RiMenu3Fill className="text-2xl" />
            )}
          </button>
        )}
      </div>
      <div className="flex">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full mx-10 md:mx-0 ${
            filter ? "hidden" : "block"
          }`}
        >
          {pdfs.map((pdf) => {
            const createdAt = new Date(pdf.createdAt);
            const updatedAt = new Date(pdf.updatedAt);
            const formattedDate = createdAt.toLocaleString("default", {
              day: "numeric",
              month: "long",
            });
            const updatedDate = updatedAt.toLocaleString("default", {
              day: "numeric",
              month: "long",
            });
            return (
              <BlogComps
                key={pdf._id}
                date={formattedDate}
                title={pdf.name}
                imageSrc={pdf.photo}
                updatedDate={updatedDate}
                id={pdf._id}
                status={pdf.status}
                category={pdf.category}
              />
            );
          })}
        </div>
        <div
          className={`z-1 flex-1 ${filter ? "block" : "hidden"} lg:flex sm:block`}
        >
          <Sidebar_pdf
            setSelectedCategory={setSelectedCategory}
            setSelectedStatus={setSelectedStatus}
            togglefilter ={togglefilter}
          />
        </div>
      </div>
    </div>
  );
}

export default Downloads;
