import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const AddHabit = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleAddHabit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const Title = form.Title.value;
    const Description = form.Description.value;
    const Category = form.Category.value;
    const reminderTime = form.time.value;
    const imageFile = form.Image.files[0];

    let imageURL = "";

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: formData,
          },
        );

        const data = await res.json();
        imageURL = data.data.url;
      }

      const habitData = {
        Title,
        Description,
        Category,
        reminderTime,
        Image: imageURL,
        userEmail: user?.email,
        userName: user?.displayName,
        createdAt: new Date(),
      };

      const response = await fetch("http://localhost:3000/my-habits", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(habitData),
      });

      const result = await response.json();

      if (result.insertedId) {
        toast.success("Habit added successfully!");
        form.reset();
      } else {
        toast.error("Failed to add habit");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#1e1b4b] p-4">
      <div className="w-full max-w-lg bg-[#312e81] p-6 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Habit</h2>

        <form onSubmit={handleAddHabit} className="space-y-4">
          <input
            type="text"
            name="Title"
            placeholder="Habit Title"
            className="input w-full"
            required
          />

          <textarea
            name="Description"
            placeholder="Description"
            className="textarea w-full "
            required
          ></textarea>

          <select name="Category" className="select w-full" required>
            <option value="">Select Category</option>
            <option>Morning</option>
            <option>Work</option>
            <option>Fitness</option>
            <option>Evening</option>
            <option>Study</option>
          </select>

          <input type="time" name="time" className="input w-full " required />
          <input type="date" name="date" className="input w-full" required />

          <input type="file" name="Image" className="file-input w-full " />

          <input
            type="text"
            value={user?.email || ""}
            readOnly
            className="input w-full text-gray-600"
          />

          <input
            type="text"
            value={user?.displayName || ""}
            readOnly
            className="input w-full text-gray-600"
          />

          <button
            type="submit"
            className="btn w-full bg-green-500 hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Habit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHabit;
