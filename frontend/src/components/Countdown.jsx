import { useEffect, useState } from "react";

export default function Countdown({ seconds }) {

    const [time, setTime] = useState(Number(seconds) || 0);


    // Sync only when backend gives a new value
    useEffect(() => {

        if(seconds !== null && seconds !== undefined){

            setTime(Number(seconds));

        }

    }, [seconds]);



    // Local countdown
    useEffect(() => {

        if(time <= 0) return;


        const timer = setInterval(()=>{

            setTime(prev => {

                if(prev <= 1){
                    clearInterval(timer);
                    return 0;
                }

                return prev - 1;

            });


        },1000);


        return ()=>clearInterval(timer);


    }, [time]);



    if(time <= 0){

        return (
            <span className="font-bold text-red-600">
                Expired
            </span>
        );

    }



    return (

        <span className="font-bold text-red-600 text-xl">

            ⏳ 00:{String(Math.floor(time)).padStart(2,"0")}

        </span>

    );

}