import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import {useAuthStore} from "./AuthStore";

// Create the store
export const useTicketStore = create(
    persist(
        (set) => ({
                tickets: [],
                loading: false,
                error: null,
                createTicket :async (projection_id) =>{
                    set({loading:true})
                    try{
                        const {user} = useAuthStore()
                        const username = user.username
                        console.log("sending req to api")
                        const { data,error } = await axios.post(`http://localhost:3000/api/ticket/`, {projection_id, username})
                        console.log("getting resp from api",data,error)

                        set({ tickets: data, error: null })

                    }catch (error){

                    } finally {

                    }
                },
                fetchTickets: async () => {
                    set({ loading: true })
                    try {
                        const { data } = await axios.get(`http://localhost:3000/api/ticket/${user.username}`)
                        set({ tickets: data, error: null })
                    } catch (error) {
                        set({
                            error: 'Failed to fetch movies',
                            tickets: []
                        })
                    } finally {
                        set({ loading: false })
                    }
                },

            }

        )
)
)