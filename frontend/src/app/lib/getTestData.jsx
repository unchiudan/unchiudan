export default async function getTestData(id) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/test/${id}`,
        { cache: 'no-store' }
      );
      const data = await response.json();
      if (data.status === "success") {
        return data.data.test;
      } else {
        throw new Error("Failed to fetch Test data");
      }
    } catch (error) {
      console.error("Error fetching Test:", error);
      throw error;
    }
  }
  