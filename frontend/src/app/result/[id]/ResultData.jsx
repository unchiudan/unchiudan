/* eslint-disable react/prop-types */
import Gold from "../../../../public/Goldd.png";
import Silver from "../../../../public/Silverr.png";
import Bronze from "../../../../public/Bronzee.png";
import Image from "next/image";




export const ResultData = ({ results }) => {
  return (
    <>
      {results.map((userResults, index) => {
        let MedalIcon = null;

        if (index === 0) {
          MedalIcon = <Image src={Gold} alt="Gold medal" className="w-[40px] h-[40px]" />;
        } else if (index === 1) {
          MedalIcon = <Image src={Silver} alt="Silver Medal" className="w-[40px] h-[40px] "/>;
        } else if (index === 2) {
          MedalIcon = <Image src={Bronze} alt="Bronze Medal" className="w-[40px] h-[40px] "/>;
        }
        
        return (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
            <td className="px-6 py-4 border-b  border border-black">
            {MedalIcon ? (
                <div className="inline-block">{MedalIcon}</div>
              ) : (
                userResults.rank
              )}
            </td>
            <td className="px-6 py-4 border-b  border border-black">
              {userResults.username}
            </td>
            {/* <td className="px-6 py-4 border-b  border border-black">{maskedEmail}</td> */}
            <td className="px-6 py-4 border-b  border border-black">
              {userResults.district}
            </td>
            <td className="px-6 py-4 border-b  border border-black">
              {userResults.maskedPhoneNumber}
            </td>
            <td className="px-6 py-4 border-b  border border-black">
              {userResults.totalQuestions}
            </td>
            <td className="px-6 py-4 border-b  border border-black">
              {userResults.correct}
            </td>
            <td className="px-6 py-4 border-b  border border-black">
              {userResults.incorrect}
            </td>
            <td className="px-6 py-4 border-b  border border-black">
              {userResults.notattempt}
            </td>
            <td className="px-6 py-4 border-b  border border-black">
              {userResults.negativemarks}
            </td>
            <td className="px-6 py-4 border-b  border border-black">
              {userResults.score}
            </td>
            <td className="px-6 py-3 border-b  border border-black">
              {userResults.percentage.toFixed(2)}
            </td>
            <td className="px-6 py-3 border-b  border border-black">
              {userResults.submittime}
            </td>
          </tr>
        );
      })}
    </>
  );
};
