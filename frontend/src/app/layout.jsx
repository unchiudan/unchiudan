import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/NavBar/Navbar";
import Footer from "./components/Home/HomeUI/Footer";
import Provider from "./provider";
import BottomToTopButton from "./components/TopDownButton/BottomToTopButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  manifest: "/manifest.json",
  title: {
    default: "ऊँची उड़ान Classes | Unchiudaan Classes ",
    template: "%s | Unchiudaan Classes ",
  },
  description:
    "Current Affairs for UPSC, BPSC, बिहार दारोगा, SI, BSSC, Railway, JSSC, SSC, BANKING, Defence, और अन्य Government Job Examinations के लिए ऊँची उड़ान वेबसाइट को join करें।",
  keywords: [
    "Daily Quiz / डेली प्रश्न",
    "Daily Current Affairs/ कर्रेंट अफेयर्स",
    "Monthly PDFs / मासिक PDF ",
    "News / Blog ,unchi udan classes",
    "unchiudaanclasses",
    "uchiudaan classes",
    "uchiudan",
    "Unchiudaan classes",
    "ऊँची उड़ान classes",
    "Daily Current Affairs",
    "Unchiudaan Current Affairs",
    "Current Affairs for UPSC",
    "BPSC",
    "बिहार दारोगा",
    "SI",
    "BSSC",
    "Railway",
    "JSSC",
    "SSC",
    "BANKING",
    "Defence",
    "और अन्य Government Job Examinations",
  ],
  twitter: {
    card: "summary_large_image",
  },
  openGraph: {
    images: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/uchiudan.png`,
    width: 800,
    height: 600,
  },
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_FRONTEND_URL}`),
  alternates: {
    canonical: `/`,
  },
  verification: {
    google: "ORCgrx0whs6--E2V59na4ij4Jakzd714qHNCkEcQ-TY",
  },
};

export const viewport = {
  themeColor: "#171717",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5012067203696612"
          strategy="lazyOnload"
          crossorigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>
        <Provider>
          <Navbar />

          {children}

          <Footer />
          <BottomToTopButton className="z-10" />
        </Provider>
      </body>
    </html>
  );
}
