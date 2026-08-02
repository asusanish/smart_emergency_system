
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function DriverStatusCard({
  demoMode,
  setDemoMode,
}) {
  return (
    <>
<Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Driver Status</h2>

            <p className="mt-2">🟢 Available for emergency requests</p>
          </div>

          <div className="text-5xl">🚑</div>
        </div>
      </Card>

      <div className="mb-6">
  <Button
    variant={demoMode ? "danger" : "primary"}
    onClick={() => setDemoMode(!demoMode)}
  >
    {demoMode ? "Stop Demo Mode" : "Start Demo Mode"}
  </Button>
</div>
</>
  )
}