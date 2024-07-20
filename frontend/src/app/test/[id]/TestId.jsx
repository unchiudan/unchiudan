"use client";
import React, { useState, useEffect } from "react";
import he from "he";
import Image from "next/image";
import StartTest from "./StartTest";
import { SocialMedia } from "../../components/Socialmedia/socialmedia";
import { usePathname, useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { useGetUserQuery } from "../../redux/slices/userSlices";

const decodeHtmlEntities = (html) => {
  return he.decode(html);
};

async function fetchUserData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login/success`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error; // Rethrow the error to handle it in the component
  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  let hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  let amOrPm = "AM";
  if (hour >= 12) {
    amOrPm = "PM";
    hour -= 12;
  }
  if (hour === 0) {
    hour = 12;
  }

  return `${day} - ${month} - ${year} ${hour}:${minute}:${second} ${amOrPm}`;
}

const TestId = ({ test }) => {
  const decodedName = decodeHtmlEntities(test.name);
  const { data: userDataFromQuery } = useGetUserQuery();
  const [userData, setUserData] = useState(null);
  const starttime = formatTimestamp(test.mainstart);
  const endtime = formatTimestamp(test.mainend);
  const [testStarted, setTestStarted] = useState(false);
  const [block, setBlock] = useState(false);
  const router = useRouter();
  const pathname=usePathname()
 

  localStorage.setItem("gotourl",pathname) 
  
  const origin =
  typeof window !== "undefined" && window.location.origin
  ? window.location.origin
  : "";
  const pageUrl = `${origin}`;
  const pageFullUrl = pageUrl + usePathname();
  
  

  const handleStartTest = () => {
    if (userData) {
      setTestStarted(true);
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = userDataFromQuery || (await fetchUserData());
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [userDataFromQuery]);

  if (testStarted) {
    return <StartTest />;
  }

  return (
    <div>
      <div className="mx-auto py-24 flex justify-center items-center">
        <div className="w-96 bg-white border rounded-lg shadow-xl">
          <h1
            className="text-center font-bold text-[2rem] md:text-[2.5rem]"
            dangerouslySetInnerHTML={{
              __html: decodeHtmlEntities(decodedName),
            }}
          ></h1>
          <div className="w-full bg-white">
            <Image
              width={500}
              height={500}
              className="w-full object-cover rounded-md"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGE}/img/usertest/${test.photo}`}
              alt={`logo`}
            />
          </div>
          <div className="p-2">
            <p className="text-gray-800 md:text-base text-[20px]">
              <strong>Start At:</strong> {starttime}
            </p>
            <p className="text-gray-800 md:text-base text-[20px]">
              <strong>End At:</strong> {endtime}
            </p>
          </div>
          <SocialMedia url={pageFullUrl} />
          <div className="p-2 w-full">
            <button
              onClick={handleStartTest}
              disabled={
                block ||
                Date.now() >= test.mainend ||
                Date.now() < test.mainstart
              }
              className={`mt-4 text-md w-full text-white bg-indigo-400 py-1 px-3 rounded-xl`}
            >
              {block || Date.now() >= test.mainend
                ? "Test Ended"
                : Date.now() < test.mainstart
                ? "Test Not Started"
                : "Start Test"}
            </button>
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default TestId;
