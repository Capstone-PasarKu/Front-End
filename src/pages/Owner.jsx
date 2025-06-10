import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/api"; // Adjust path as needed
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";

const Owner = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (!token) {
        console.log("No token found, redirecting to /login");
        navigate("/login");
        return;
      }

      try {
        const profileData = await getProfile(token);
        console.log("Profile data:", profileData);
        if (profileData.role !== "owner") {
          console.log("User is not owner, redirecting to /");
          navigate("/");
          return;
        }
        setProfile(profileData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err.message, err.response?.data);
        setError(err.message || "Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F5DC]">
        <div className="text-[#1C5532] text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F5DC]">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5DC] py-10 px-4">
      <div className="container mx-auto max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#1C5532] mb-6 text-center">
          Owner Profile
        </h1>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FiUser className="text-[#76AB51] w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-lg font-medium text-[#1C5532]">{profile.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FiMail className="text-[#76AB51] w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium text-[#1C5532]">
                {profile.email}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FiPhone className="text-[#76AB51] w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-lg font-medium text-[#1C5532]">
                {profile.phoneNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FiMapPin className="text-[#76AB51] w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-lg font-medium text-[#1C5532]">
                {profile.address}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FiCalendar className="text-[#76AB51] w-6 h-6" />
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="text-lg font-medium text-[#1C5532]">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Owner;