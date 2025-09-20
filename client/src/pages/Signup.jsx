import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success) {
        alert(data?.message);
        navigate("/login");
      } else {
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="flex items-center justify-center bg-gradient-to-b from-blue-950 to-blue-500 px-4"
      style={{ minHeight: "calc(100vh - 64px)" }} // adjust navbar height
    >
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                placeholder="Your username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

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

            <div className="flex flex-col space-y-1">
              <Label htmlFor="address">Address</Label>
              <textarea
                id="address"
                placeholder="Your address"
                value={formData.address}
                onChange={handleChange}
                maxLength={200}
                className="p-2 border rounded resize-none"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                type="tel"
                id="phone"
                maxLength="10"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-between text-sm text-blue-700">
              <Link to="/login" className="hover:underline">
                Already have an account? Login
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Signup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
