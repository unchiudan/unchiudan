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

export default function page() {
  const [totalUsers, setTotalUsers] = useState(0);
  const { data: userData } = useGetUserQuery();
  let role;

  if (userData) {
    role = userData.role === "admin";
  } else {
    role = false;
  }
  const [toogle, setToogle] = useState(false);
  const [open, setOpen] = useState("");
  const [show, setShow] = useState(false);

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

  // useEffect hook to fetch total users on component mount
  useEffect(() => {
    fetchTotalUsers();
  }, []);

  function handleWindow(value) {
    setOpen(value);
  }

  return (
    <div className="mt-[100px] mb-[50px]">
      <div className="">
        {role && (
          <>
          <div className="flex justify-center ">
            <div className="w-1/2 text-right">
              <p className=" text-xl  font-medium p-2 ">
                Welcome Admin
              </p>{" "}
            </div>

            <div className="w-1/2 text-right">
              {" "}
              <span className="text-center mb-8 md:mb-0 md:order-2 md:mr-8">
                <strong>Total Users </strong>
                
                <p className="bg-[#06ca06] text-white rounded px-2 py-2 inline-block ">
                  {totalUsers}🧑
                </p>
              </span>
            </div>
            </div>
            <hr />
            <div className="flex h-[92%]">
              <div className="w-1/6 border-r-2 px-2 pt-5 leading-10  ">
                <button
                  className={`${open === "news" ? "text-[#4793AF]" : ""}`}
                  onClick={() => handleWindow("news")}
                >
                  Create News
                </button>
                <hr />
                <button
                  className={`${open === "test" ? "text-[#4793AF]" : ""}`}
                  onClick={() => handleWindow("test")}
                >
                  Create Test
                </button>
                <hr />
                <button
                  className={`${
                    open === "currentaffairs" ? "text-[#4793AF]" : ""
                  }`}
                  onClick={() => handleWindow("currentaffairs")}
                >
                  Create CurrentAffairs
                </button>
                <hr />
                <button
                  className={`${open === "dailytest" ? "text-[#4793AF]" : ""}`}
                  onClick={() => handleWindow("dailytest")}
                >
                  Create DailyTest
                </button>
                <hr />
                <button
                  className={`${open === "pdf" ? "text-[#4793AF]" : ""}`}
                  onClick={() => handleWindow("pdf")}
                >
                  Create Pdf
                </button>
                <hr />
              </div>
              <div className="w-5/6 overflow-auto flex-grow">
                {open === "news" ? (
                  <FormNews />
                ) : open === "test" ? (
                  <FormTest />
                ) : open === "currentaffairs" ? (
                  <FormCurrentAffairs />
                ) : open === "pdf" ? (
                  <FormPDF />
                ) : open === "dailytest" ? (
                  <DailyTest />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
