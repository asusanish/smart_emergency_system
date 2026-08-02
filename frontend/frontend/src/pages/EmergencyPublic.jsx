import { useState } from "react";
import api from "../api/axios";


export default function EmergencyPublic(){

    const [form,setForm] = useState({

        name:"",
        phone:"",
        emergency_type:"Accident",
        description:""

    });


    const [location,setLocation] = useState(null);
    const [message,setMessage] = useState("");



    const handleChange=(e)=>{

        setForm({

            ...form,
            [e.target.name]:e.target.value

        });

    };



    const getLocation=()=>{

        navigator.geolocation.getCurrentPosition(

            (position)=>{

                setLocation({

                    latitude:position.coords.latitude,
                    longitude:position.coords.longitude

                });


                setMessage("Location captured ✅");

            },


            ()=>{

                setMessage("Location permission denied");

            }

        );

    };



    const sendSOS=async()=>{


        if(!location){

            alert("Please get location first");
            return;

        }


        try{


            const response = await api.post(
                "/public-emergency",
                {

                    ...form,

                    latitude:location.latitude,

                    longitude:location.longitude

                }
            );


            console.log(response.data);


            setMessage(
                "🚑 Ambulance request sent successfully"
            );


        }
        catch(error){

            console.log(error);

            setMessage(
                "Emergency request failed"
            );

        }


    };



    return(

        <div className="min-h-screen bg-slate-100 flex items-center justify-center">


            <div className="bg-white p-8 rounded-xl shadow w-96">


                <h1 className="text-3xl font-bold text-red-600 mb-5">

                    🚨 Emergency SOS

                </h1>



                <input

                name="name"

                placeholder="Your Name"

                className="border p-3 w-full mb-3"

                onChange={handleChange}

                />



                <input

                name="phone"

                placeholder="Phone Number"

                className="border p-3 w-full mb-3"

                onChange={handleChange}

                />



                <select

                name="emergency_type"

                className="border p-3 w-full mb-3"

                onChange={handleChange}

                >

                    <option>
                        Accident
                    </option>

                    <option>
                        Medical Emergency
                    </option>

                    <option>
                        Fire
                    </option>


                </select>



                <textarea

                name="description"

                placeholder="Describe emergency"

                className="border p-3 w-full mb-3"

                onChange={handleChange}

                />



                <button

                onClick={getLocation}

                className="bg-blue-600 text-white w-full py-3 rounded mb-3"

                >

                    📍 Get Location

                </button>



                <button

                onClick={sendSOS}

                className="bg-red-600 text-white w-full py-3 rounded"

                >

                    🚨 SEND SOS

                </button>



                <p className="mt-4">

                    {message}

                </p>


            </div>


        </div>

    )

}