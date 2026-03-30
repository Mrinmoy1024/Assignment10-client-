import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const UpdateHabit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [habit, setHabit] = useState({
    Title: "",
    Description: "",
    Category: "",
    reminderTime: "",
    date: "",
    Image: "",
    userEmail: user?.email || "",
    userName: user?.displayName || "",
  });

  useEffect(() => {
    const fetchHabit = async () => {
      try {
        const res = await fetch(
          `https://habit-tracker-server-taupe.vercel.app/my-habits/${id}`,
        );
        const data = await res.json();
        setHabit(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load habit");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchHabit();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      let imageURL = habit.Image;

      const imageFile = e.target.image.files[0];
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          { method: "POST", body: formData },
        );
        const data = await res.json();
        imageURL = data.data.url;
      }

      const updatedHabit = {
        Title: e.target.Title.value,
        Description: e.target.Description.value,
        Category: e.target.Category.value,
        reminderTime: e.target.time.value,
        date: e.target.date.value,
        Image: imageURL,
      };

      const res = await fetch(
        `https://habit-tracker-server-taupe.vercel.app/my-habits/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedHabit),
        },
      );

      const result = await res.json();

      if (result.modifiedCount > 0) {
        toast.success("Habit updated successfully!");
        navigate("/habits");
      } else {
        toast.error("No changes made or update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#1e1b4b]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#1e1b4b] p-4">
      <div className="w-full max-w-lg bg-[#312e81] p-6 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Habit</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            name="Title"
            placeholder="Habit Title"
            className="input w-full"
            defaultValue={habit.Title}
            required
          />

          <textarea
            name="Description"
            placeholder="Description"
            className="textarea w-full"
            defaultValue={habit.Description}
            required
          />

          <select
            name="Category"
            className="select w-full"
            defaultValue={habit.Category}
            required
          >
            <option value="">Select Category</option>
            <option>Morning</option>
            <option>Work</option>
            <option>Fitness</option>
            <option>Evening</option>
            <option>Study</option>
          </select>

          <input
            type="time"
            name="time"
            className="input w-full"
            defaultValue={habit.reminderTime}
            required
          />
          <input
            type="date"
            name="date"
            className="input w-full"
            defaultValue={habit.date?.slice(0, 10)}
            required
          />

          <div>
            <label className="block mb-1">Current Image</label>
            {habit.Image && (
              <img
                src={habit.Image}
                alt={habit.Title}
                className="w-32 h-32 object-cover rounded mb-2"
              />
            )}
            <input type="file" name="image" className="file-input w-full" />
          </div>

          <input
            type="text"
            value={habit.userEmail}
            readOnly
            className="input w-full text-gray-400"
          />
          <input
            type="text"
            value={habit.userName}
            readOnly
            className="input w-full text-gray-400"
          />

          <button
            type="submit"
            className="btn w-full bg-green-500 hover:bg-green-700"
            disabled={updating}
          >
            {updating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Updating...
              </span>
            ) : (
              "Update Habit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateHabit;
