import { createContext, useContext, useState } from "react";

const RideContext = createContext();

export const RideProvider = ({ children }) => {

    const getTodayDate = () => {
        const today = new Date();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const year = today.getFullYear();

        return `${year}-${month}-${day}`;
    }

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [price, setPrice] = useState("");
    const [seats, setSeats] = useState("");
    const [vehicleId, setVehicleId] = useState("");
    const [sourceLoc, setSourceLoc] = useState(null);
    const [destLoc, setDestLoc] = useState(null);
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    const [time, setTime] = useState(getCurrentTime());
    const [selecting, setSelecting] = useState("source");
    const[vehicle, setVehicle] =  useState([]);


    return (
        <RideContext.Provider value={{
            source, setSource,
            destination, setDestination,
            sourceLoc, setSourceLoc,
            destLoc, setDestLoc,
            price, setPrice,
            seats, setSeats,
            vehicleId, setVehicleId,
            selectedDate, setSelectedDate,
            selecting, setSelecting,
            time, setTime,
            vehicle, setVehicle
        }}>
            {children}
        </RideContext.Provider>
    )
}

export const useRide = () => {
    return useContext(RideContext)
};