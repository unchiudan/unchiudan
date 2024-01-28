import { Link } from "react-router-dom";

export function StartTest() {
  return (
    <div className="mx-auto py-24 flex justify-center items-center">
      <div className="w-96 bg-white rounded-lg p-6 shadow-md">
        <div className="text-2xl font-bold mb-4">BSSC 2nd इन्टर लेवल test</div>
        <div className="text-gray-500 text-sm mb-4">(27 जनवरी 2024)</div>
        <form className="grid gap-4">
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="number" className="text-sm text-gray-600">
              Phone Number
            </label>
            <input
              id="number"
              type="text"
              placeholder="Enter your Phone number"
              className="border border-gray-300 p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="districts" className="text-sm text-gray-600">
              Districts
            </label>
            <select
              id="districts"
              className="border border-gray-300 p-2 rounded-md"
            >
              <option value="" disabled selected>
                Select
              </option>
              <option value="next">Next.js</option>
              <option value="sveltekit">SvelteKit</option>
              <option value="astro">Astro</option>
              <option value="nuxt">Nuxt.js</option>
            </select>
          </div>
        </form>
        <div className="flex justify-between mt-6">
          <Link to="/test">
            <button className="bg-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-400">
              Cancel
            </button>
          </Link>
          <Link to="/liveTest">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Start
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
