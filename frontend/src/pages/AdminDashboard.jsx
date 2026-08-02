import {useEffect,useState} from "react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";


function AdminDashboard(){

    const [data,setData] = useState(null);


    const loadDashboard = async()=>{

        try{

            const response = await api.get(
                "/admin/dashboard",
                {
                    headers:{
                        Authorization:
                        `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );


            setData(response.data);

        }
        catch(error){

            console.log(error);

        }

    };


    useEffect(()=>{

        loadDashboard();

    },[]);



    return(

        <DashboardLayout title="Patient Dashboard">


            <h1>
                🏥 Admin Dashboard
            </h1>


            {
                data &&

                <div>


                    <h2>
                        👥 Total Users:
                        {data.total_users}
                    </h2>


                    <h2>
                        🚑 Total Ambulances:
                        {data.total_ambulances}
                    </h2>


                    <h2>
                        🟢 Available Ambulances:
                        {data.available_ambulances}
                    </h2>


                    <h2>
                        🚨 Active Emergencies:
                        {data.active_emergencies}
                    </h2>


                    <h2>
                        ✅ Completed:
                        {data.completed_emergencies}
                    </h2>


                </div>
            }


       </DashboardLayout>

    )

}


export default AdminDashboard;