/* eslint-disable react/prop-types */
import NewsCard from "./components/NewsCard";

export const metadata = {
  title: "News / Blog",
  description: "नवीनतम घटनाओं के साथ अपडेट रहें",
  alternates: {
    canonical: `/news`,
  },
};

function News() {
  return (
    <div className="py-[6rem] md:py-[8rem] ">

        <h1 className="mx-[2%]  text-3xl lg:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center text-center">
          <span className="mr-2">Daily News</span>
          <span className="text-green-500 text-lg lg:text-xl">
            नवीनतम घटनाओं के साथ अपडेट रहें
          </span>
        </h1>
        <NewsCard />

    </div>
  );
}

export default News;
