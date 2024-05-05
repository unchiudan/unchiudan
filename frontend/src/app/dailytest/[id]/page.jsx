import React from 'react'
import DailyTestPage from './dailyTest'
import getDailyTestId from "../../lib/getDailyTest"



export async function generateMetadata({ params: { id } }) {
  const DailyTest = await getDailyTestId(id)
  const removeHtmlTags = (html) => {
    return html.replace(/<[^>]*>?/gm, "");
  };

  return {
    title: removeHtmlTags(DailyTest.name),
    description: removeHtmlTags(DailyTest.description),
        alternates:{
        canonical: `/dailytest/${id}`
      },
    openGraph: {
      images: `${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGE}/img/dailytests/${DailyTest.photo}`,
      width: 900,
      height: 450,
    },
  };
}

async function page({ params: { id } }) {

  const DailyTest = await getDailyTestId(id)

  return (
    <div>
     <DailyTestPage  QuizId={DailyTest}/>
    </div>
  )
}

export default page