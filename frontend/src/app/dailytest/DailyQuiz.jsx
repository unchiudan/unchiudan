"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useGetUserQuery } from "../redux/slices/userSlices";
import { MdOutlineDelete } from "react-icons/md";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";

export default function DailyQuiz() {
  const { data: userData } = useGetUserQuery();
  const [dailytest, setDailyTest] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  let role;

  if (userData) {
    role = userData.role === "admin";
  } else {
    role = false;
  }
  console.log(role, "role");

  const fetchData = (page) => {
    let apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/dailytest?&page=${page}&limit=${postsPerPage}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const { totallength } = response.data;

        setDailyTest(response.data.data.dailytest);
        setTotalPages(Math.ceil(parseInt(totallength) / postsPerPage));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  if (!dailytest) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-info motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, postsPerPage]);

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

  const handlePostsPerPageChange = (value) => {
    setPostsPerPage(value);
    setCurrentPage(1); // Reset page number to 1 when limit changes
  };

  const decodeHtmlEntities = (html) => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };
  console.log(dailytest);

  const handleDeleteClick = async (event, testId) => {
    event.preventDefault();
    event.stopPropagation();

    if (window.confirm("Are you sure you want to delete this item?")) {
      const token = localStorage.getItem("jwt_token");
      let loadingToast;
      try {
        loadingToast = toast.loading("Deleting Daily Test..."); // Display loading toast
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/dailytest/${testId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (response.status === 200) {
          toast.dismiss(loadingToast);
          toast.success("Daily Test deleted successfully");
        } else {
          toast.dismiss(loadingToast);
          console.error("Error deleting Daily Test item:", response);
          toast.error("Error deleting Daily Test item");
        }
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Error deleting Daily Test item:", error);
        toast.error("Error deleting Daily Test item");
      }
    }
  };

  return (
    <div className="">
      <div className="gap-4 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  grid-cols-1 ">
        {dailytest.map((test) => {
          const createdAt = new Date(test.createdAt);
          const formattedDate = createdAt.toLocaleString("default", {
            day: "numeric",
            month: "long",
          });
          //   const isRecent = isWithin48Hours(test.createdAt);
          const decodedName = decodeHtmlEntities(test.name);
          const decodedDescription = decodeHtmlEntities(test.description);
          const maxDescriptionLength = 200;
          const trimmedDescription =
            decodedDescription.length > maxDescriptionLength
              ? decodedDescription.substring(0, maxDescriptionLength) + "..."
              : decodedDescription;

          return (
            <div
              key={test.id}
              className="border shadow-md rounded-md bg-slate-100"
            >
              <div className="relative flex justify-center h-[13rem]">
                {role ? (
                  <button
                    className="absolute top-0 right-0 text-red-600 cursor-pointer bg-red-500 rounded-full p-2"
                    style={{ zIndex: 1 }}
                    onClick={(event) => handleDeleteClick(event, test._id)}
                  >
                    <MdOutlineDelete size={32} color="#fff" />
                  </button>
                ) : (
                  ""
                )}
                <Image
                  width={500}
                  height={500}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGE}/img/dailytests/${test.photo}`}
                  alt={test.name}
                  className="w-full h-[200px] object-cover rounded-xl border"
                />
              </div>
              
              <div className="p-2">
              <p className=" text-sm mb-2">{formattedDate}</p>
                <h3
                  className="text-lg font-semibold mb-2"
                  dangerouslySetInnerHTML={{ __html: decodedName }}
                />
                <p
                  className="md:text-lg text-gray-500 text-lg overflow-hidden mb-[1rem]"
                  dangerouslySetInnerHTML={{ __html: trimmedDescription }}
                />
                
                <Link href={`/dailytest/${test._id}`}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Start Now
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
