import { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "./ui/Card";
import Button from "./ui/Button";

function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const loadProfile = async () => {
    try {
      const response = await api.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setProfile(response.data.profile);

      setForm({
        name: response.data.profile.name || "",
        phone: response.data.profile.phone || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const updateProfile = async () => {
    try {
      await api.put(
        "/user/profile",
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Profile Updated Successfully");

      setEditing(false);

      loadProfile();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Update failed");
    }
  };

  if (!profile) return null;

  return (
    <Card className="p-6 mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">👤 My Profile</h2>

        {!editing ? (
          <Button onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <Button onClick={updateProfile}>
            Save Changes
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <p className="text-gray-500">Name</p>

          {editing ? (
            <input
              className="border rounded-lg p-2 w-full"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          ) : (
            <h3 className="font-bold">{profile.name}</h3>
          )}
        </div>

        <div>
          <p className="text-gray-500">Phone</p>

          {editing ? (
            <input
              className="border rounded-lg p-2 w-full"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />
          ) : (
            <h3 className="font-bold">
              {profile.phone || "N/A"}
            </h3>
          )}
        </div>

        <div>
          <p className="text-gray-500">Email</p>

          <h3 className="font-bold">{profile.email}</h3>
        </div>

        <div>
          <p className="text-gray-500">Role</p>

          <h3 className="font-bold capitalize">
            {profile.role}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">Joined</p>

          <h3 className="font-bold">
            {new Date(profile.created_at).toLocaleDateString()}
          </h3>
        </div>

      </div>
    </Card>
  );
}

export default UserProfile;