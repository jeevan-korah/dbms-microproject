import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updatePassStart,
  updatePassSuccess,
  updatePassFailure,
} from "../../redux/user/userSlice";

// ShadCN UI
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const UpdateProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  const [updatePassword, setUpdatePassword] = useState({
    oldpassword: "",
    newpassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        email: currentUser.email,
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handlePass = (e) =>
    setUpdatePassword({ ...updatePassword, [e.target.id]: e.target.value });

  const updateUserDetails = async (e) => {
    e.preventDefault();
    if (
      currentUser.username === formData.username &&
      currentUser.email === formData.email &&
      currentUser.address === formData.address &&
      currentUser.phone === formData.phone
    ) {
      alert("Change at least 1 field to update details");
      return;
    }
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.success && res.status !== 200 && res.status !== 201) {
        dispatch(updateUserFailure(data?.message));
        alert("Session Ended! Please login again");
        return;
      }
      if (data.success) {
        dispatch(updateUserSuccess(data?.user));
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserPassword = async (e) => {
    e.preventDefault();
    if (!updatePassword.oldpassword || !updatePassword.newpassword) {
      alert("Enter a valid password");
      return;
    }
    if (updatePassword.oldpassword === updatePassword.newpassword) {
      alert("New password can't be same!");
      return;
    }
    try {
      dispatch(updatePassStart());
      const res = await fetch(`/api/user/update-password/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePassword),
      });
      const data = await res.json();

      if (!data.success && res.status !== 200 && res.status !== 201) {
        dispatch(updatePassFailure(data?.message));
        alert("Session Ended! Please login again");
        return;
      }
      dispatch(updatePassSuccess());
      alert(data?.message);
      setUpdatePassword({ oldpassword: "", newpassword: "" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-center p-4">
      <Tabs defaultValue="profile" className="w-full max-w-md">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="profile">Update Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        {/* Update Profile */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Update Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                id="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <Textarea
                id="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />
              <Input
                id="phone"
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <Button
                disabled={loading}
                onClick={updateUserDetails}
                className="w-full"
              >
                {loading ? "Updating..." : "Update"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change Password */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                id="oldpassword"
                type="password"
                placeholder="Enter old password"
                value={updatePassword.oldpassword}
                onChange={handlePass}
              />
              <Input
                id="newpassword"
                type="password"
                placeholder="Enter new password"
                value={updatePassword.newpassword}
                onChange={handlePass}
              />
              <Button
                disabled={loading}
                onClick={updateUserPassword}
                className="w-full"
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpdateProfile;
