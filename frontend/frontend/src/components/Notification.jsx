export default function Notification({message}) {

    if(!message) return null;


    return (
        <div
        className="
        fixed
        top-5
        right-5
        z-50
        bg-green-500
        text-white
        px-6
        py-4
        rounded-xl
        shadow-xl
        animate-bounce
        "
        >

            🚑 {message}

        </div>
    );

}