import React from "react";
import StartTest from "./StartTest";
import getTestData from "../../lib/getTestData";
import he from "he";

import TestId from "./TestId";

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
export async function generateMetadata({ params: { id } }) {
  try {
    // Fetch test data
    const test = await getTestData(id);

    // Check if test data is defined
    if (!test) {
      throw new Error("Test data not found.");
    }

    const starttime = formatTimestamp(test.mainstart);
    // Decode and sanitize HTML
    const decodeAndRemoveHtml = (html) => {
      // Check if HTML is defined
      if (!html) {
        return "";
      }
      // Decode HTML entities
      const decodedHtml = he.decode(html);
      // Remove HTML tags
      const plainText = decodedHtml.replace(/<[^>]*>?/gm, "");
      return plainText;
    };

    
    // const endtime = formatTimestamp(test.mainend);

    // const oneMinuteAfterEnd = test.mainend + 60000
    // // Generate metadata
    return {
      title: decodeAndRemoveHtml(test.name),
      description: decodeAndRemoveHtml(test.data.ques), // Use optional chaining to handle undefined test.data
      alternates: {
        canonical: `/test/${id}`,
      },
      openGraph: {
        images: `${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGE}/img/usertest/${test.photo}`,
        width: 900,
        height: 450,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {}; // Return empty object if an error occurs
  }
}

async function Test({ params: { id } }) {
  try {
    // Fetch test data
    const test = await getTestData(id);

    if (!test) {
      throw new Error("Test data not found.");
    }

    // Render StartTest component
    return (
      <div className="py-7 h-full w-full ">
        <TestId test={test} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching test data:", error);
    return null; // Return null if an error occurs
  }
}

export default Test;
