import { Link, useLocation, useNavigate } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import googleIcon from "../assets/google.png";
const Login = () => {
  const { signInUser, signInWithGoogle } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogIn = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    signInUser(email, password)
      .then((result) => {
        event.target.reset();
        navigate(location.state?.from || "/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        navigate(location.state?.from || "/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#281b46] px-4">
      <div className="card w-full max-w-sm bg-[#382070] shadow-2xl rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleLogIn} className="space-y-4 ">
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
            <label className="mb-1 font-medium ">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input rounded-full px-4 py-2"
              required
            />
          </div>

          <div className="text-right">
            <a
              href="#"
              className="text-sm text-indigo-500 hover:text-indigo-700"
            >
              Forgot password?
            </a>
          </div>

          <button type="submit" className="btn w-full mt-4 py-2 rounded-full ">
            Login
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="btn w-full mt-4 py-2 rounded-full border border-gray-300 font-semibold hover:bg-gray-50 transition"
        >
          <img src={googleIcon} className="w-5" /> Login with Google
        </button>

        <p className="text-center text-sm mt-4">
          New to our website?{" "}
          <Link
            to="/register"
            className="text-indigo-500 hover:text-indigo-700"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
