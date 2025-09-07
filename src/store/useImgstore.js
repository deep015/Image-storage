import {create} from 'zustand'
import { persist } from 'zustand/middleware'

export const useImgstore= create(persist((set) => ({
    images:[],
    setImages: (payload) => set((state)=>({
        images:[...state.images,payload]
    })),
    deleteImg:(id)=>set((state)=>({
        images:state.images.filter((img)=>img.id!==id)
    }))
}),
))