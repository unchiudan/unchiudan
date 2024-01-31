/* eslint-disable react/prop-types */
import Gold from "../../../../../public/Gold.png";
import Silver from "../../../../../public/Silver.png";
import Bronze from "../../../../../public/Bronze.png";

// Function to mask part of the email
// const maskEmail = (email) => {
//   const atIndex = email.indexOf('@');
//   const maskedPart = email.substring(1, atIndex);
//   const maskedEmail = email.replace(maskedPart, '*'.repeat(maskedPart.length));
//   return maskedEmail;
// };

export const ResultData = ({ results }) => {
  const sortedResults = [...results].sort((a, b) => {
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage;
    } else {
      // If percentages are the same, sort based on submittime
      return new Date(a.submittime) - new Date(b.submittime);
    }
  });

  return (
    <>
      {sortedResults.map((userResults, index) => {
        const {
          username,
    
          userphone,
          totalQuestions,
          correct,
          score,
          notattempt,
          submittime,
          negativemarks,
          district,
          percentage,
        } = userResults;
        const incorrect = totalQuestions - correct - notattempt;

        let MedalIcon = null;

        if (index === 0) {
          MedalIcon = <img src={Gold} alt="Gold medal" />;
        } else if (index === 1) {
          MedalIcon = <img src={Silver} alt="Silver Medal" />;
        } else if (index === 2) {
          MedalIcon = <img src={Bronze} alt="Bronze Medal" />;
        }

        {/* // Mask part of the email
        const maskedEmail = maskEmail(useremail); */}

        // Mask the phone number
        const maskedPhoneNumber = userphone.replace(/.(?=.{4})/g, 'X');

        return (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
            <td className="px-6 py-4 border-b  border border-black">{MedalIcon || index + 1}</td>
            <td className="px-6 py-4 border-b  border border-black">{username}</td>
            {/* <td className="px-6 py-4 border-b  border border-black">{maskedEmail}</td> */}
            <td className="px-6 py-4 border-b  border border-black">{district}</td>
            <td className="px-6 py-4 border-b  border border-black">{maskedPhoneNumber}</td>
            <td className="px-6 py-4 border-b  border border-black">{totalQuestions}</td>
            <td className="px-6 py-4 border-b  border border-black">{correct}</td>
            <td className="px-6 py-4 border-b  border border-black">{incorrect}</td>
            <td className="px-6 py-4 border-b  border border-black">{notattempt}</td>
            <td className="px-6 py-4 border-b  border border-black">{negativemarks}</td>
            <td className="px-6 py-4 border-b  border border-black">{score}</td>
            <td className="px-6 py-3 border-b  border border-black">{percentage}</td>
            <td className="px-6 py-3 border-b  border border-black">{submittime}</td>
          </tr>
        );
      })}
    </>
  );
};
