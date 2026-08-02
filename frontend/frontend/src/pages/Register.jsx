import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


export default function Register(){

const navigate = useNavigate();


const [form,setForm]=useState({

    name:"",
    email:"",
    password:"",
    role:"patient"

});


const handleChange=(e)=>{

    setForm({

        ...form,
        [e.target.name]:e.target.value

    });

};



const register=async(e)=>{

e.preventDefault();


try{

await api.post(
    "/register",
    form
);


alert("Registration successful");

navigate("/");


}
catch(error){

console.log(error);

alert("Registration failed");

}

};



return(

<div className="min-h-screen flex items-center justify-center bg-slate-100">


<form
onSubmit={register}
className="bg-white p-8 rounded-xl shadow w-96"
>


<h1 className="text-2xl font-bold mb-6">
Create Account
</h1>


<input
name="name"
placeholder="Full Name"
className="border p-3 w-full mb-3"
onChange={handleChange}
/>


<input
name="email"
placeholder="Email"
className="border p-3 w-full mb-3"
onChange={handleChange}
/>


<input
name="password"
type="password"
placeholder="Password"
className="border p-3 w-full mb-3"
onChange={handleChange}
/>


<select
name="role"
className="border p-3 w-full mb-3"
onChange={handleChange}
>

<option value="patient">
Patient
</option>

<option value="driver">
Driver
</option>

</select>


<button
className="bg-red-600 text-white w-full py-3 rounded"
>

Register

</button>


</form>


</div>

)

}