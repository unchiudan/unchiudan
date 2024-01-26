import React from "react";
import HighlightText from "../core/Homepage/HighlightText";
import { Helmet } from "react-helmet-async";

import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

const socialMediaIcons = {
  github: FaGithub,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
};

const users = [
  {
    name: "Anuraj Kumar",

    description: "Developer",
    image: "anuraj",
    socialMediaLinks: {
      whatsapp: "https://wa.me/qr/BVXAB2P45DNLL1",
      github: "https://github.com/user2",
      linkedin: "https://www.linkedin.com/in/anuraj-kumar-softwaredeveloper/",
      twitter: "https://twitter.com/anurajkumar23",
      instagram:
        "https://www.instagram.com/anurajkumar6294?utm_source=qr&igsh=MTY1dm5kNzU4YXR1cg==",
    },
  },
  {
    name: "Ishu Singh",

    description: "Developer",
    image: "ishu",
    socialMediaLinks: {
      github: "https://github.com/ishuoncode",
      linkedin: "https://www.linkedin.com/in/ishu-singh-software-developer/",
      twitter: "/",
      instagram: "https://www.instagram.com/_._ishurajput/",
    },
  },
  {
    name: "Kingshuk Mondal",

    description: "Developer",
    image: "kingshuk",
    socialMediaLinks: {
      github: "https://github.com/ImKKingshuk",
      linkedin: "https://linkedin.com/in/ImKKingshuk",
      twitter: "https://twitter.com/ImKKingshuk",
      instagram: "https://www.instagram.com/ImKKingshuk",
    },
  },
  {
    name: "Puskar Roy",

    description: "Developer",
    image: "puskar",
    socialMediaLinks: {
      github: "https://github.com/user2",
      linkedin: "https://github.com/user2",
      twitter: "https://twitter.com/user2",
      instagram: "https://www.instagram.com/user2/",
    },
  },
];

function DevTeam() {
  return (
    <div>
      <Helmet>
        <title>UnchiUdaan - Developers</title>

        <meta
          name="description"
          content="Developers of UnchiUdaan"
          data-rh="true"
        />
        <meta
          name="keywords"
          content="unchi udan classes, unchiudaanclasses, uchiudaan classes,uchiudan,Unchiudaan classes,ऊँची उड़ान classes,
  Daily Current Affairs,Unchiudaan Current Affairs, Current Affairs for UPSC, BPSC,बिहार दारोगा,SI,BSSC,Railway,JSSC, SSC, BANKING, Defence,और अन्य Government Job Examinations"
          data-rh="true"
        />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Unchiudaan - Developers" />
        <meta property="og:description" content="Developers of UnchiUdaan" />
        <meta
          property="og:image"
          content="https://unchiudaanclasses.com/uchiudan.png"
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Unchiudaan - Developers" />
        <meta name="twitter:description" content="Developers of UnchiUdaan" />
        <meta
          name="twitter:image"
          content="https://unchiudaanclasses.com/uchiudan.png"
        />

        <meta name="author" content="Anuraj kumar, ishu singh, @ImKKingshuk" />
      </Helmet>
      <h1 className="text-[2rem] text-center py-[6rem] ">
        Developers of <HighlightText text={"ऊँची उड़ान"} />
      </h1>

      <div className="lg:flex md:flex sm:flex items-center xl:justify-between flex-wrap md:justify-around sm:justify-around lg:justify-around">
        {users.map((user, index) => (
          <div
            key={index}
            className="xl:w-1/3 sm:w-3/4 md:w-2/5 relative mt-16 mb-32 sm:mb-24 xl:max-w-sm lg:w-2/5"
          >
            <div className="rounded overflow-hidden shadow-md bg-white">
              <div className="absolute -mt-20 w-full flex justify-center">
                <div className="h-32 w-32">
                  <img
                    src={`/Devs/${user.image}.jpeg`}
                    alt={`Display Picture of ${user.name}`}
                    className="rounded-full object-cover h-full w-full shadow-md"
                  />
                </div>
              </div>
              <div className="px-6 mt-16">
                <h1 className="font-bold text-3xl text-center mb-1">
                  {user.name}
                </h1>

                <p className="text-center text-gray-600 text-base pt-2 font-normal">
                  {user.description}
                </p>
                <div className="w-full flex justify-center pt-5 pb-5">
                  {Object.entries(user.socialMediaLinks).map(
                    ([media, link]) => (
                      <a
                        key={media}
                        href={link}
                        className="mx-5"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="text-[1.5rem]">
                          {React.createElement(socialMediaIcons[media])}
                        </div>
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DevTeam;
