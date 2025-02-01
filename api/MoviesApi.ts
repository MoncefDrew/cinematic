import axios from "axios";



export const fetchFilms = async () => {
    try {
        const { data } = await axios.get(`http://localhost:5000/api/film`);
        return data; // The data will already be parsed for you
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching films:", error.response ? error.response.data : error.message);
        } else {
            // @ts-ignore
            console.error("Error fetching films:", error.message);
        }
        return [];
    }
};


export const MostRatedFilms = async () =>{
    try {
        const { data } = await axios.get(`http://localhost:5000/api/film/popular`);
        console.log(data)
        return data; // The data will already be parsed for you
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error fetching MostRated films:", error.response ? error.response.data : error.message);
        } else {
            // @ts-ignore
            console.error("Error fetching MostRated films:", error.message);
        }
        return [];
    }
}