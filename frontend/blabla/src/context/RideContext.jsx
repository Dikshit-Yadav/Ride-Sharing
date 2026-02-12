import { createContext,useContext, useState} from "react";

const RideContext = createContext();

export const RideProvider = ({ children }) => {

    const getTodayDate = () => {
        const today = new Date();
        return today.toString().split("T")[0]
    }

    const getCurrentTime = () => {
        const now = new Date();
        return now.toString().slice(0, 5)
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



    return(
        <RideContext.Provider value={{
source, setSource,
destination, setDestination,
sourceLoc, setSourceLoc,
destLoc, setDestLoc,
price, setPrice,
seats, setSeats,
vehicleId, setVehicleId,
selectedDate, setSelectedDate,
time, setTime
        }}>
            {children}
        </RideContext.Provider>
    )
}

export const useRide = () => {
    return useContext(RideContext)
};