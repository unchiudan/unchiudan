import { useState, useEffect } from "react";
import VideoBg from "./video.mp4";

const ComingSoon = () => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 20);

  const calculateTimeRemaining = () => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days,
        hours,
        minutes,
        seconds,
      };
    } else {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="coming-soon-container relative min-h-screen overflow-hidden">
      <Helmet>
        <title>Daily Current Affairs/ कर्रेंट अफेयर्स</title>
        <meta
          name="description"
          content="Current Affairs for UPSC, BPSC, बिहार दारोगा, SI, BSSC, Railway, JSSC, SSC, BANKING, Defence.."
        />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Unchiudan tests" />
        <meta
          property="og:description"
          content="Current Affairs for UPSC, BPSC, बिहार दारोगा, SI, BSSC, Railway, JSSC, SSC, BANKING, Defence.."
        />
        <meta
          property="og:image"
          content="https://unchiudaanclasses.com/uchiudan.png"
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Unchiudan Tests" />
        <meta
          name="twitter:description"
          content="Current Affairs for UPSC, BPSC, बिहार दारोगा, SI, BSSC, Railway, JSSC, SSC, BANKING, Defence.."
        />
        <meta
          name="twitter:image"
          content="https://unchiudaanclasses.com/uchiudan.png"
        />

        <meta name="author" content="Anuraj kumar, ishu singh, @ImKKingshuk" />
      </Helmet>

      <video
        className="h-full w-full object-cover absolute inset-0"
        src={VideoBg}
        autoPlay
        muted
        loop
      ></video>
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <div className="timer-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-20">
        <h1 className="text-4xl font-bold ">Launching Soon!</h1>
        <p className="text-xl mb-4">
          टेस्ट सीरीज जल्द ही लॉन्च होने जा रही है।
        </p>
        <div className="countdown grid grid-cols-4 gap-4">
          <div className="time-unit">
            <span className="text-3xl font-bold">{timeRemaining.days}</span>
            <p className="text-sm">Days</p>
          </div>
          <div className="time-unit">
            <span className="text-3xl font-bold">{timeRemaining.hours}</span>
            <p className="text-sm">Hours</p>
          </div>
          <div className="time-unit">
            <span className="text-3xl font-bold">{timeRemaining.minutes}</span>
            <p className="text-sm">Minutes</p>
          </div>
          <div className="time-unit">
            <span className="text-3xl font-bold">{timeRemaining.seconds}</span>
            <p className="text-sm">Seconds</p>
          </div>
        </div>
        <p className="text-xl mt-4">Launching Soon. Stay tuned!</p>
      </div>
    </div>
  );
};

export default ComingSoon;
