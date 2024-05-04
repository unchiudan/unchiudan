export default async function getDailyTestId(id) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/dailytest/${id}`,
        { cache: 'no-store' }
      );
      const data = await response.json();
  
      if (data.status === "success") {
        return data.data.dailytest;
      } else {
        throw new Error("Failed to fetch Dailytest ID data");
      }
    } catch (error) {
      console.error("Error fetching DailyTest:", error);
      throw error;
    }
  }
  