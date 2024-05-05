import React from 'react'
import DailyQuiz from "./DailyQuiz"

const page = () => {
  return (
    <div className='md:mx-4 py-[8rem] '>
       <h1 className="mx-[2%]  text-3xl lg:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center text-center">
          <span className="mr-2 text-red-600">Daily Quiz</span>
          <span className="text-green-500 text-lg lg:text-xl">
            Stay Updated
          </span>
        </h1>
      <DailyQuiz />
    </div>
  )
}

export default page
