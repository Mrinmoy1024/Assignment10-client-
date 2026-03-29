import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import googleLogo from "../assets/google.png";
const Register = () => {
  const { loading, createUser, updateUserProfile, signInWithGoogle } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    const displayName = event.target.displayName.value;
    const photoURL = event.target.photoURL.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      toast.loading("Creating user...", { id: "create-user" });

      const result = await createUser(email, password);
      await updateUserProfile(displayName, photoURL);

      const userData = {
        name: displayName,
        email: email,
        photoURL: photoURL,
        createdAt: new Date(),
      };

      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      toast.success("User created successfully!", { id: "create-user" });
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message, { id: "create-user" });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      toast.loading("Creating user...", { id: "create-user" });

      const result = await signInWithGoogle();
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      };

      await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      toast.success("User created successfully!", { id: "create-user" });
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message, { id: "create-user" });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center  bg-[#281b46] px-4">
      <div className="card w-full max-w-sm shadow-2xl  bg-[#382070] rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Name</label>
            <input
              type="text"
              name="displayName"
              placeholder="Name"
              className="input rounded-full px-4 py-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Photo URL</label>
            <input
              type="text"
              name="photoURL"
              placeholder="Photo URL"
              className="input rounded-full px-4 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input rounded-full px-4 py-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input rounded-full px-4 py-2"
              required
            />
          </div>

          <button type="submit" className="w-full mt-4 py-2 rounded-full btn">
            Register
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 py-2 rounded-full border btn font-semibold"
        >
          <img src={googleLogo} className="w-5" /> Register with Google
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:text-indigo-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
