import {
  AlertTriangle,
  Ambulance,
  Navigation,
  CheckCircle,
  BellRing,
  Hospital,
  XCircle,
  RefreshCcw,
} from "lucide-react";


const getTimelineIcon = (status = "") => {

  if(status.includes("Requested")){
    return <BellRing size={20}/>;
  }

  if(status.includes("Assigned")){
    return <Ambulance size={20}/>;
  }

  if(status.includes("Accepted")){
    return <CheckCircle size={20}/>;
  }

  if(status.includes("Way") || status.includes("Started")){
    return <Navigation size={20}/>;
  }

  if(status.includes("Completed")){
    return <Hospital size={20}/>;
  }

  if(status.includes("Cancelled")){
    return <XCircle size={20}/>;
  }

  if(status.includes("Reassign")){
    return <RefreshCcw size={20}/>;
  }


  return <Activity size={20}/>;

};


const getTimelineColor = (status="")=>{

  if(status.includes("Requested"))
    return "bg-yellow-500";


  if(status.includes("Assigned"))
    return "bg-blue-500";


  if(status.includes("Accepted"))
    return "bg-green-500";


  if(status.includes("Way") || status.includes("Started"))
    return "bg-indigo-500";


  if(status.includes("Completed"))
    return "bg-green-700";


  if(status.includes("Cancelled"))
    return "bg-red-500";


  if(status.includes("Reassign"))
    return "bg-orange-500";


  return "bg-gray-500";

};

const statusConfig = {
  "Emergency Requested": {
    icon: AlertTriangle,
    color: "bg-red-500",
  },

  "Ambulance Assigned": {
    icon: Ambulance,
    color: "bg-blue-500",
  },

  "On The Way": {
    icon: Navigation,
    color: "bg-yellow-500",
  },

  Completed: {
    icon: CheckCircle,
    color: "bg-green-500",
  },
};


export default function EmergencyTimeline({ timeline }) {
      console.log("Timeline component data:", timeline);
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Emergency Timeline</h2>

      <div className="relative">
        {/* Vertical Line */}

        <div className="absolute left-5 top-5 bottom-5 w-1 bg-slate-200"></div>

        <div className="space-y-8">
          {timeline.length === 0 ? (
            <p className="text-gray-500">No timeline updates yet</p>
          ) : (
            timeline.map((item, index) => {
              const config =
                statusConfig[item.status] ||
                statusConfig["Emergency Requested"];

              const Icon = config.icon;

              return (
                <div key={item.id} className="relative flex gap-5">
                  {/* Icon */}

                  <div
                    className={`
                    relative z-10
                    w-10
                    h-10
                    rounded-full
                    ${config.color}
                    flex
                    items-center
                    justify-center
                    text-white
                    shadow-lg
                  `}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Content */}

                  <div>
                    <h3 className="font-bold text-lg">{item.status}</h3>

                    <p className="text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
