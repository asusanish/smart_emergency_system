import DashboardLayout from "../../layouts/DashboardLayout";
import PatientHistory from "../../components/PatientHistory";

export default function PatientHistoryPage() {
  return (
    <DashboardLayout title="Emergency History">
      <PatientHistory />
    </DashboardLayout>
  );
}