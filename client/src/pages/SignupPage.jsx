import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthstore.js";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
  });

  const { signUp, isSigningUp } = useAuthStore();

  const validateForm = () => {
    const { email, fullName, password } = formData;
    if (!email || !fullName || !password) {
      toast.error("All fields are required.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();
    if (success == true) signUp(formData);
  };

  return (
    // Added a light background to the page to make the form stand out
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-2 text-slate-900">
          Create your Account
        </h2>
        <p className="text-slate-600 mb-6">Let's get you started!</p>

        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium mb-2 text-slate-700"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            placeholder="Full Name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-slate-700"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full p-2 border text-black border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSigningUp}
          className="w-full py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSigningUp ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2 inline-block" />{" "}
              Signing Up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
        <div className="flex  text-center">
          <p className="flex mt-4 text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignupPage;
