import { useEffect, useState } from "react";
import api from "../../api/axios";

import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import UserModal from "./UserModal";

function UserManagement() {
  const [users, setUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    try {
      const response = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers(response.data.users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getRoleVariant = (role) => {
    switch (role) {
      case "admin":
        return "danger";

      case "driver":
        return "info";

      case "patient":
        return "success";

      default:
        return "secondary";
    }
  };

  return (
    <Card className="mt-8 p-6">
      <h2 className="text-2xl font-bold mb-5">👥 User Management</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>

              <th>Email</th>

              <th>Phone</th>

              <th>Role</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3 font-semibold">{user.name}</td>

                <td>{user.email}</td>

                <td>{user.phone ?? "-"}</td>

                <td>
                  <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                </td>

                <td>
                  <Button onClick={() => setSelectedUser(user)}>👁 View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserModal
        user={selectedUser}

        onClose={() => setSelectedUser(null)}
      />
    </Card>
  );
}

export default UserManagement;
