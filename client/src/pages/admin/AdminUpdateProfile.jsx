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
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const AdminUpdateProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [updateProfileDetailsPanel, setUpdateProfileDetailsPanel] =
    useState(true);
  const [formData, setFormData] = useState({
    username: "",
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
        address: currentUser.address,
        phone: currentUser.phone,
        avatar: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePass = (e) => {
    setUpdatePassword({
      ...updatePassword,
      [e.target.id]: e.target.value,
    });
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    if (
      currentUser.username === formData.username &&
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
      if (data.success && res.status === 201) {
        alert(data?.message);
        dispatch(updateUserSuccess(data?.user));
      } else if (data.success === false) {
        dispatch(updateUserFailure(data?.message));
        alert("Session Ended! Please login again");
      } else {
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
      if (data.success) {
        dispatch(updatePassSuccess());
        alert(data?.message);
        setUpdatePassword({ oldpassword: "", newpassword: "" });
      } else {
        dispatch(updatePassFailure(data?.message));
        alert("Session Ended! Please login again");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-center p-4">
      {updateProfileDetailsPanel ? (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Update Profile
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-1"
              >
                Username
              </label>
              <Input
                id="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-1"
              >
                Address
              </label>
              <Textarea
                id="address"
                maxLength={200}
                value={formData.address}
                onChange={handleChange}
                className="resize-none"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-2">
              <Button
                disabled={loading}
                onClick={updateUserDetails}
                className="flex-1"
              >
                {loading ? "Loading..." : "Update"}
              </Button>
              <Button
                variant="destructive"
                disabled={loading}
                onClick={() => setUpdateProfileDetailsPanel(false)}
                className="flex-1"
              >
                {loading ? "Loading..." : "Change Password"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Change Password
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4 pt-4">
            <div>
              <label
                htmlFor="oldpassword"
                className="block text-sm font-medium mb-1"
              >
                Old Password
              </label>
              <Input
                id="oldpassword"
                type="password"
                value={updatePassword.oldpassword}
                onChange={handlePass}
              />
            </div>
            <div>
              <label
                htmlFor="newpassword"
                className="block text-sm font-medium mb-1"
              >
                New Password
              </label>
              <Input
                id="newpassword"
                type="password"
                value={updatePassword.newpassword}
                onChange={handlePass}
              />
            </div>

            <div className="flex gap-2">
              <Button
                disabled={loading}
                onClick={updateUserPassword}
                className="flex-1"
              >
                {loading ? "Loading..." : "Update Password"}
              </Button>
              <Button
                variant="destructive"
                disabled={loading}
                onClick={() => {
                  setUpdateProfileDetailsPanel(true);
                  setUpdatePassword({ oldpassword: "", newpassword: "" });
                }}
                className="flex-1"
              >
                {loading ? "Loading..." : "Back"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminUpdateProfile;
