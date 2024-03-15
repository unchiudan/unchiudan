import loginImg from "../../../public/Images/login.webp";
import AdBanner from "../AdBanner";
import Template from "./Template"


export const metadata = {
  title: 'Login Page',
  description: 'Join us for Latest update Free/पैड PDFs of current Affairs',
  alternates:{
    canonical: `/login`
  },
}

function Login() {
  return (
    <div className="mx-auto py-[4rem]">

      <Template
        title="Welcome Back"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={loginImg}
        formType="login"
      />
      <AdBanner
       data-ad-slot="1848801465"
       data-ad-format="auto"
       data-full-width-responsive="true"
      />
    </div>
  );
}

export default Login;
