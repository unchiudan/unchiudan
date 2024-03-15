
/* eslint-disable no-unused-vars */
import React from "react";
import TestCard from "./components/TestCard"
import AdBanner from "../AdBanner";

export const metadata = {
  title: "Live Test / लाइव टेस्ट",
  description:
    "Get Live Test / लाइव टेस्ट of Current Affairs..",
    alternates:{
      canonical: `/test`
    },
};


// eslint-disable-next-line react/prop-types
function TestPage() {
  
  return (
    <div className="mx-auto py-[6rem]">
      <AdBanner
       data-ad-slot="1848801465"
       data-ad-format="auto"
       data-full-width-responsive="true"
      />
      <TestCard/>    
    </div>
  );
}
export default TestPage;
