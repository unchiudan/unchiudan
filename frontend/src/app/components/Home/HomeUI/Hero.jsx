"use client";
import Link from "next/link";
import { FaTelegramPlane } from "react-icons/fa";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import AdBanner from "../../../AdBanner";
import Typewriter from "typewriter-effect";

function Hero() {
  return (
    <>
      <div className="bg-[#F9F9F9] md:mx-8 mx-6">
        <div className=" overflow-hidden relative lg:flex lg:items-center">
          {/* Ensure AdBanner is properly implemented */}
          <AdBanner
            data-ad-slot="1848801465"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <div className="w-full py-12 ">
            <h2 className="mt-14 text-[1.6rem] text-center md:text-[2.5rem] font-extrabold text-black">
              <span className="text-[4rem] ">
                <span className="text-[#0089AB] ">ऊँची</span>{" "}
                <span className="text-[#FF1E33] "> उड़ान</span>{" "}
              </span>
              <br /> में आपका स्वागत है!
            </h2>
            <p className="text-md mt-4 text-gray-600 text-justify">
              <Typewriter
                options={{
                  strings: [
                    "Current Affairs for UPSC, BPSC, All State PCS, बिहार दारोगा,SI,BSSC, Railway, JSSC, SSC(CGL, CPO, GD) BANKING, Defence,Police,KVS,CTET और अन्य Competitive और Government Job Examinations के लिए ऊँची उड़ान वेबसाइट और Telegram पेज को join करें। ",
                  ],
                  autoStart: true,
                  loop: true,
                  delay: 30,
                }}
              />
            </p>

            <div className="mt-12 flex justify-center items-center space-x-3">
              <Link href="/Currentaffairs">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] mx-auto lg:text-[18px] text-[14px] text-white rounded-full px-4 py-1 hover:scale-105 duration-500 "
                >
                  Start Learning & Fly High
                </button>
              </Link>
              <Link href="https://t.me/UnchiudaanClasses">
                <div className=" flex w-fit hover:bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] px-2 py-1  text-lg mx-auto rounded-full bg-blue-500 text-white">
                  <FaTelegramPlane className="w-7 h-7" />
                </div>
              </Link>
              <Link href="https://whatsapp.com/channel/0029Va4aeIXHgZWdVRD0GA0k">
                <div className=" flex w-fit hover:bg-gradient-to-b from-[#25D366] to-[#128C7E] px-2 py-1  text-lg mx-auto rounded-full bg-green-500 text-white">
                  <FaWhatsapp className="w-7 h-7" />
                </div>
              </Link>
              <Link href="https://www.facebook.com/profile.php?id=100093014962073&mibextid=ZbWKwL">
              <div className=" flex w-fit bg-gradient-to-b from-[#4267B2] to-[#1877F2] px-2 py-1  text-lg mx-auto rounded-full hover:to-blue-600 cursor-pointer text-white">
                <FaFacebook className="w-7 h-7" />
              </div>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-8 p-2 lg:p-24">
            {/* Ensure image paths are correct */}
            <img
              src="/Images/bpsc.jpeg"
              className="w-1/2 rounded-lg"
              alt="Meow"
            />
            <div>
              <img
                src="/Images/upsc.jpeg"
                className="mb-8 rounded-lg"
                alt="Meow"
              />
              <img src="/Images/ssc.jpeg" className="rounded-lg" alt="Meow" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
