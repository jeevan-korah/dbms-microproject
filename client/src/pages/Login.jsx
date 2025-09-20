import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success) {
        dispatch(loginSuccess(data?.user));
        toast.success(data?.message);
        navigate("/");
      } else {
        dispatch(loginFailure(data?.message));
        toast.error(data?.message);
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
      console.log(err);
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-gradient-to-b from-green-950 to-green-500 px-4"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm text-blue-700">
              <Link to="/signup" className="hover:underline">
                Don't have an account? Sign up
              </Link>
              {/* <Link to="/forgot-password" className="hover:underline">
                Forgot password?
              </Link> */}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
