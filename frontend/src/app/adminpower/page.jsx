"use client";
import { useEffect, useState } from "react";
import { useGetUserQuery } from "../redux/slices/userSlices";
import FormNews from "./FormNews";
import FormTest from "./FormTest";
import FormCurrentAffairs from "./FormCurrentAffairs";
import FormPDF from "./FormPDF";
import DailyTest from "./DailyTest";
import toast from "react-hot-toast";
import axios from "axios";

export default function Page() {
  const [totalUsers, setTotalUsers] = useState(0);
  const { data: userData } = useGetUserQuery();
  const isAdmin = userData?.role === "admin";
  const [open, setOpen] = useState("");

  const fetchTotalUsers = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      const { results } = response.data;
      setTotalUsers(results);
    } catch (error) {
      console.error("Error fetching total users:", error);
      toast.error("Error fetching total users");
    }
  };

  useEffect(() => {
    fetchTotalUsers();
  }, []);

  function handleWindow(value) {
    setOpen(value);
  }

  return (
    <div className="my-14 md:my-[8rem] py-10 md:py-5 md:mb-50px">
      {isAdmin && (
        <div>
          <div className="flex flex-col md:flex-row items-center justify-center w-full md:gap-x-12  ">
            <p className="text-xl font-medium">Welcome Admin</p>
            <div className="text-center md:mb-0 md:order-2 md:mr-8">
              <strong>Total Users </strong>
              <p className="bg-[#06ca06] text-white rounded px-2 inline-block">
                {totalUsers}🧑
              </p>
            </div>
          </div>
          {/* <hr /> */}
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/6 border-r-2 px-2 pt-5 leading-10">
              <button
                className={`w-full ${
                  open === "news" ? "text-white bg-red-600 shadow-xl rounded-xl" : ""
                }`}
                onClick={() => handleWindow("news")}
              >
                Create News
              </button>

              <hr />
              <button
                className={`w-full ${open === "test" ? "text-white bg-red-600 shadow-xl rounded-xl" : ""}`}
                onClick={() => handleWindow("test")}
              >
                Create Test
              </button>
              <hr />
              <button
                className={`w-full ${
                  open === "currentAffairs" ? "text-white bg-red-600 shadow-xl rounded-xl" : ""
                }`}
                onClick={() => handleWindow("currentAffairs")}
              >
                Create CurrentAffairs
              </button>
              <hr />
              <button
                className={`w-full ${open === "dailyQuiz" ? "text-white bg-red-600 shadow-xl rounded-xl" : ""}`}
                onClick={() => handleWindow("dailyQuiz")}
              >
                Create DailyQuiz
              </button>
              <hr />
              <button
                className={`w-full ${open === "pdf" ? "text-white bg-red-600 shadow-xl rounded-xl" : ""}`}
                onClick={() => handleWindow("pdf")}
              >
                Create Pdf
              </button>
              <hr />
            </div>
            <div className="w-full md:w-5/6 overflow-auto">
              {open === "news" ? (
                <FormNews />
              ) : open === "test" ? (
                <FormTest />
              ) : open === "currentAffairs" ? (
                <FormCurrentAffairs />
              ) : open === "pdf" ? (
                <FormPDF />
              ) : open === "dailyQuiz" ? (
                <DailyTest />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
