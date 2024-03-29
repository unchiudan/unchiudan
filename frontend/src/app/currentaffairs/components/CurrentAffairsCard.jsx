"use client";

import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { BlogComps } from "./AffairsContainer";
import { RiMenu3Fill, RiCloseFill } from "react-icons/ri";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useGetUserQuery } from "../../redux/slices/userSlices";

const CurrentAffairsCard = () => {
  const { data: userData, error, isLoading } = useGetUserQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [affairs, setAffairs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filter, setFilter] = useState(false);

  const togglefilter = () => {
    setFilter(!filter);
  };

  const fetchData = (page, category) => {
    let apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/currentaffairs`;

    if (category) {
      apiUrl += `?category=${category}&page=${page}&limit=${postsPerPage}`;
    } else {
      apiUrl += `?page=${page}&limit=${postsPerPage}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        const { affairs } = response.data.data;
        const { totallength } = response.data;

        setAffairs(affairs);
        setTotalPages(Math.ceil(parseInt(totallength) / postsPerPage));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData(currentPage, selectedCategory);
  }, [selectedCategory, currentPage, postsPerPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset page number to 1 when category changes
  };

  const handlePostsPerPageChange = (value) => {
    setPostsPerPage(value);
    setCurrentPage(1); // Reset page number to 1 when limit changes
  };
  const handleDeleteSuccess = () => {
    fetchData(currentPage, selectedCategory); // Fetch data again after successful deletion
  };

  return (
    <div>
      <div className="p-2 md:hidden ">
        <div className="flex items-center">
          <button
            onClick={togglefilter}
            className="text-black hover:text-gray-300 focus:outline-none "
          >
            {filter ? (
              <RiCloseFill className="text-2xl" />
            ) : (
              <RiMenu3Fill className="text-2xl" />
            )}
          </button>
          {!filter && (
            <button
              onClick={togglefilter}
              className="ml-2 px-3 py-1 text-gray-600 text-sm bg-gray-200 hover:bg-gray-300 focus:outline-none rounded"
            >
              View more
            </button>
          )}
        </div>
      </div>
      <div className="flex">
        <div
          className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full mx-3 md:mx-0 ${
            filter ? "hidden" : "block"
          }`}
        >
          {affairs.length === 0 ? (
            <div className="items-center justify-center ">
              <p className="text-center  text-gray-500">
                No CurrentAffairs available.
              </p>
            </div>
          ) : (
            affairs.map((blog) => {
              const createdAt = new Date(blog.createdAt);
              const updatedAt = new Date(blog.updatedAt);
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
                  key={blog._id}
                  date={formattedDate}
                  title={blog.topic}
                  imageSrc={blog.photo}
                  updatedDate={updatedDate}
                  category={blog.category}
                  set_no={blog.set_no}
                  id={blog._id}
                  userData={userData}
                  onDeleteSuccess={handleDeleteSuccess}
                />
              );
            })
          )}
        </div>

        <div
          className={`z-1 flex-1 ${
            filter ? "block" : "hidden"
          } lg:flex sm:block`}
        >
          <Sidebar
            setSelectedCategory={handleCategoryChange}
            togglefilter={togglefilter}
          />
        </div>
      </div>

      <div className="flex justify-center my-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`
            px-4 py-2 mx-2 rounded-full
            ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }
          `}
        >
          <i className="fas fa-chevron-left mr-2"></i> Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`
            px-4 py-2 mx-2 rounded-full
            ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }
          `}
        >
          Next <i className="fas fa-chevron-right ml-2"></i>
        </button>
      </div>
      <div className="text-center text-gray-500">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex justify-center mt-4">
        <div className="mr-2">Show:</div>
        <select
          value={postsPerPage}
          onChange={(e) => handlePostsPerPageChange(e.target.value)}
          className="px-2 py-1 border rounded-md"
        >
          <option value="12">12</option>
          <option value="24">24</option>
          <option value="48">48</option>
          <option value="60">60</option>
        </select>
      </div>
    </div>
  );
};

export default CurrentAffairsCard;
