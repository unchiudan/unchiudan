import loginImg from "../../../public/Images/login.webp";
import usePageSEO from "../../hooks/usePageSEO/usePageSEO";
import Template from "../Home/core/Auth/Template";


function Login() {
  usePageSEO({
    title: 'Unchi Udaan Classes - Login',
    description: 'Login to your Unchi Udaan Classes account for access to exclusive content.',
    keywords: ['login', 'account', 'education'],
    ogTitle: 'Unchi Udaan Classes - Login',
    ogDescription: 'Login to your Unchi Udaan Classes account for access to exclusive content.',
    ogImage: 'https://unchiudaanclasses.com/uchiudan.png',
    ogUrl: 'https://unchiudaanclasses.com/login',
  })
  return (
    <div className="mx-auto py-[4rem]">
      <Template
        title="Welcome Back"
        description1="Build skills for today, tomorrow, and beyond."
        description2="Education to future-proof your career."
        image={loginImg}
        formType="login"
      />
    </div>
  );
}

export default Login;
