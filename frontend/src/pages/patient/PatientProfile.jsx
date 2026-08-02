import DashboardLayout from "../../layouts/DashboardLayout";
import UserProfile from "../../components/UserProfile";

export default function PatientProfile() {
  return (
    <DashboardLayout title="My Profile">
      <UserProfile />
    </DashboardLayout>
  );
}