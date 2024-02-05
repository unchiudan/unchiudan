import signupImg from "../../../public/Images/signup.webp"
import usePageSEO from "../../hooks/usePageSEO/usePageSEO"
import Template from "../Home/core/Auth/Template"


function Signup() {
  usePageSEO({
    title: 'Unchi Udaan Classes - Signup',
    description: 'Create a new account at Unchi Udaan Classes to access premium content.',
    keywords: ['signup', 'account creation', 'education'],
    ogTitle: 'Unchi Udaan Classes - Signup',
    ogDescription: 'Create a new account at Unchi Udaan Classes to access premium content.',
    ogImage: 'https://unchiudaanclasses.com/uchiudan.png',
    ogUrl: 'https://unchiudaanclasses.com/signup',
  })
  return (
    <div className="mx-auto py-[4rem]">
    <Template
      title="Join for the learning free"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={signupImg}
      formType="signup"
    />
    </div>
  )
}

export default Signup