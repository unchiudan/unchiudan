/* eslint-disable react/prop-types */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { AiFillRead } from "react-icons/ai";
import { BiSolidNews } from "react-icons/bi";
import { FaHome, FaFilePdf } from "react-icons/fa"; // Import the icons you need
import Testicon from "./icons/icons8-test.gif";
import logo from "../../../../public/uchiudan.png";
import { useGetUserQuery } from "../../redux/slices/userSlices";
import { usePathname } from "next/navigation";

async function fetchData() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/login/success`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return null;
  }
}

export default function Navbar() {
  // console.log(userData.user.email)
  const { data: userDataFromQuery } = useGetUserQuery();
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const navLink = [
    {
      name: "DAILY QUIZ",
      link: "/dailytest",
    },
    {
      name: "LIVE TEST",
      link: "/test",
    },
    {
      name: "ABOUTUS",
      link: "/AboutUs",
    },
  ];

  useEffect(() => {
    async function fetchDataManually() {
      try {
        const userData = await fetchData();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    if (!userDataFromQuery) {
      fetchDataManually();
    } else {
      setUserData(userDataFromQuery);
    }
  }, [userDataFromQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      setScrollDirection(currentScrollPos > prevScrollPos ? "down" : "up");
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`
        );
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("An error occurred while fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/logout`);
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const googlelogout = async () => {
    localStorage.clear()
    const email = userData.email;
    window.open(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, "_self");
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
      email,
    });
  };

  const pathname = usePathname();

  return (
    <div className="">
      <nav className="backdrop-blur  w-full text-black border-b border-slate-200 p-2 z-50  bg-slate-100 fixed">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <Image
              width={500}
              height={500}
              src={logo}
              className="w-12 md:w-20"
              alt="logo"
            />
          </Link>
          <div className="md:hidden">
            {userData ? (
              <div className="relative" onClick={() => setOpen(!open)}>
                <div className="flex items-center gap-x-1">
                  {user && user.image ? (
                    <Image
                      src={user.image}
                      alt={`profile-${user.firstName}`}
                      className="aspect-square w-[30px] rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-[30px] h-[30px] flex items-center justify-center text-sm text-white bg-blue-500  hover:bg-blue-700 rounded-full">
                      {userData
                        ? `${userData.firstname.charAt(
                            0
                          )} ${userData.lastname.charAt(0)}`
                        : ""}
                    </span>
                  )}
                  {open ? (
                    <AiOutlineCaretUp className="text-sm text-[#AFB2BF]" />
                  ) : (
                    <AiOutlineCaretDown className="text-sm text-[#AFB2BF]" />
                  )}
                </div>
                {open && (
                  <div className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-[#2C333F] overflow-hidden rounded-md border-[1px] border-[#2C333F] bg-[#161D29] cursor-pointer">
                    <Link href="/user" onClick={() => setOpen(false)}>
                      <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-[#AFB2BF] hover:bg-[#2C333F] hover:text-[#DBDDEA]">
                        <VscDashboard className="text-lg" />
                        Dashboard
                      </div>
                    </Link>
                    <div
                      onClick={() => {
                        {
                          userData.googleLogIn
                            ? googlelogout()
                            : handleLogout();
                        }
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-[#AFB2BF] hover:bg-[#2C333F] hover:text-[#DBDDEA]"
                    >
                      <VscSignOut className="text-lg " />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <span className="w-full rounded-full py-1 px-5  bg-blue-500 md:w-max  hover:bg-blue-700 text-white text-center font-semibold shadow-md">
                  Login
                </span>
              </Link>
            )}
          </div>
          <div className="hidden md:flex space-x-6 text-xl">
            <Link href="/" className="block">
              HOME
            </Link>
            <Link href="/test" className="block">
              LIVE TEST
            </Link>
            <Link href="/currentaffairs" className="block focus:outline-none">
              CURRENT AFFAIRS
            </Link>
            <Link href="/news" className="block">
              NEWS
            </Link>
            <div className="relative group">
              <Link href="/pdfs" className="block">
                PDF'S
              </Link>
            </div>
            <a href="/sitemap.xml" className="block"></a>
            {userData ? (
              <div className="relative" onClick={() => setOpen(!open)}>
                <div className="flex items-center gap-x-1">
                  {user && user.image ? (
                    <Image
                      src={user.image}
                      alt={`profile-${user.firstName}`}
                      className="aspect-square w-[30px] rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-[30px] h-[30px] flex items-center justify-center text-sm text-white  bg-blue-500  hover:bg-blue-700 rounded-full">
                      {userData
                        ? `${userData.firstname.charAt(
                            0
                          )} ${userData.lastname.charAt(0)}`
                        : ""}
                    </span>
                  )}
                  {open ? (
                    <AiOutlineCaretUp className="text-sm text-[#AFB2BF]" />
                  ) : (
                    <AiOutlineCaretDown className="text-sm text-[#AFB2BF]" />
                  )}
                </div>
                {open && (
                  <div className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-[#2C333F] overflow-hidden rounded-md border-[1px] border-[#2C333F] bg-[#161D29] cursor-pointer">
                    <Link href="/user" onClick={() => setOpen(false)}>
                      <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-[#AFB2BF] hover:bg-[#2C333F] hover:text-[#DBDDEA]">
                        <VscDashboard className="text-lg" />
                        Dashboard
                      </div>
                    </Link>
                    <div
                      onClick={() => {
                        {
                          userData.googleLogIn
                            ? googlelogout()
                            : handleLogout();
                        }
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-[#AFB2BF] hover:bg-[#2C333F] hover:text-[#DBDDEA] "
                    >
                      <VscSignOut className="text-lg " />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <span className="w-full rounded-full py-1 px-5 bg-blue-500 md:w-max hover:bg-blue-700 text-white text-center font-semibold shadow-md">
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div
        className={`text-center md:py-8 py-6 h-8 border-b border-slate-200 bg-white w-full shadow-xl text-black p-1 z-20 fixed  transition-transform duration-300 ${
          scrollDirection === "up"
            ? "transform translate-y-full"
            : "transform translate-y-0"
        }`}
      >
        <div
          className="overflow-x-auto"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "::-webkit-scrollbar": { display: "none" },
          }}
        >
          <div className="flex ml-2 text-xs gap-x-6">
            {navLink.map(({ link, name }) => {
              const isActive = pathname.startsWith(link);

              return (
                <Link key={name} href={link}>
                  <div
                    className={`block cursor-pointer ${
                      isActive ? "text-red-600" : ""
                    }`}
                  >
                    {name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className={`bottom-0 bg-white w-full shadow-xl text-black p-1 pt-4 pb-4 z-50 fixed md:hidden transition-transform duration-300 ${
          scrollDirection === "down"
            ? "transform translate-y-full"
            : "transform translate-y-0"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center text-xs">
          <Link
            href="/"
            onClick={toggleMenu}
            className="flex flex-col items-center"
          >
            <FaHome className="mr-2 w-5 h-5" />
            HOME
          </Link>

          <Link
            href="/test"
            onClick={toggleMenu}
            className="flex flex-col items-center focus:outline-none"
          >
            <Image src={Testicon} alt="Test Icon" className="mr-2  w-5 h-5" />
            LIVE TEST
          </Link>

          <Link
            href="/currentaffairs"
            onClick={toggleMenu}
            className="flex flex-col items-center focus:outline-none"
          >
            <AiFillRead className="mr-2  w-5 h-5" />
            CURRENT AFFAIRS
          </Link>

          <Link
            href="/news"
            onClick={toggleMenu}
            className="flex flex-col items-center"
          >
            <BiSolidNews className="mr-2 w-5 h-5" />
            NEWS
          </Link>

          <Link
            href="/pdfs"
            onClick={toggleMenu}
            className="flex flex-col items-center"
          >
            <FaFilePdf className="mr-2 w-5 h-5" />
            PDF'S
          </Link>
        </div>
      </div>
    </div>
  );
}
