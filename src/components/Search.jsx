import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const CATEGORIES = [
  "All",
  "Morning",
  "Work",
  "Fitness",
  "Evening",
  "Study",
  "Mental Health",
  "Health",
  "Productivity",
  "Self Development",
];

const Search = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("https://habit-tracker-server-taupe.vercel.app/habits")
      .then((res) => res.json())
      .then((data) => {
        setHabits(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch =
      habit.Title?.toLowerCase().includes(search.toLowerCase()) ||
      habit.Description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || habit.Category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const showResults = search.trim() !== "" || selectedCategory !== "All";

  return (
    <section className="w-full px-4 py-12 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-center text-white mb-8">
        Find Your Next Habit
      </h2>

      <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by title or keyword..."
          className="input w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="select w-full md:w-56"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {showResults && (
          <button
            className="btn bg-gray-600 hover:bg-gray-500 text-white"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : showResults ? (
        <>
          <p className="text-gray-400 text-sm text-center mb-4">
            Showing {filteredHabits.length} of {habits.length} habits
          </p>

          {filteredHabits.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
              <p className="text-xl">No habits found</p>
              <p className="text-sm mt-2">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {filteredHabits.map((habit) => (
                <div
                  key={habit._id}
                  className="bg-[#1e1b4b] border border-indigo-800 p-4 rounded-xl shadow flex flex-col"
                >
                  <img
                    src={habit.Image}
                    className="w-full h-40 object-cover rounded"
                    alt={habit.Title}
                  />
                  <h2 className="text-lg font-bold mt-2 text-white">
                    {habit.Title}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {habit.Description}
                  </p>
                  <span className="mt-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs w-fit">
                    {habit.Category}
                  </span>
                  <div className="flex justify-end gap-2 mt-auto pt-3">
                    <Link to={`/habit-details/${habit._id}`}>
                      <button className="btn btn-sm bg-indigo-500 hover:bg-indigo-700 text-white">
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 text-sm">
          Start typing or select a category to find habits
        </p>
      )}
    </section>
  );
};

export default Search;
