import Card from "../ui/Card";
import Button from "../ui/Button";

function UserModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div
      className="
        fixed inset-0
        bg-black/40
        flex
        items-center
        justify-center
        z-50
        "
    >
      <Card className="w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">User Details</h2>

        <div className="space-y-3">
          <p>
            <b>Name:</b> {user.name}
          </p>

          <p>
            <b>Email:</b> {user.email}
          </p>

          <p>
            <b>Phone:</b> {user.phone ?? "-"}
          </p>

          <p>
            <b>Role:</b> {user.role}
          </p>
        </div>

        <Button className="mt-6" onClick={onClose}>
          Close
        </Button>
      </Card>
    </div>
  );
}

export default UserModal;
