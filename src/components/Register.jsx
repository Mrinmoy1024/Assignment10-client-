import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import googleLogo from "../assets/google.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const { createUser, updateUserProfile, signInWithGoogle } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registering, setRegistering] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const validatePassword = (password) => {
    if (password.length < 6)
      return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(password))
      return "Password must have at least one uppercase letter.";
    if (!/[a-z]/.test(password))
      return "Password must have at least one lowercase letter.";
    return null;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const displayName = event.target.displayName.value;
    const photoURL = event.target.photoURL.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const validationError = validatePassword(password);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setRegistering(true);

      await createUser(email, password);
      await updateUserProfile(displayName, photoURL);

      const userData = {
        name: displayName,
        email,
        photoURL,
        createdAt: new Date(),
      };

      await fetch("https://habit-tracker-server-taupe.vercel.app/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(userData),
      });
      toast.success("Account created successfully!");
      setRegistering(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message, { id: "create-user" });
    } finally {
      navigate("/");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setRegistering(true);

      const result = await signInWithGoogle();
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
      };

      await fetch("https://habit-tracker-server-taupe.vercel.app/users", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(userData),
      });

      toast.success("User created successfully!", { id: "create-user" });
      setRegistering(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message, { id: "create-user" });
    } finally {
      navigate("/");
    }
  };

  if (registering) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#281b46] px-4">
      <div className="card w-full max-w-sm shadow-2xl bg-[#382070] rounded-2xl p-6">
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

          <div className="flex flex-col relative">
            <label className="mb-1 font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="input rounded-full px-4 py-2 pr-10"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-0 bottom-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-indigo-700 py-2 rounded-full btn"
          >
            Register
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 py-2 rounded-full border btn bg-indigo-700 font-semibold"
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
