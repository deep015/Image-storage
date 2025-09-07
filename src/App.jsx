import React from 'react'
import 'animate.css'
import { Upload } from 'lucide-react'
import { ToastContainer, toast } from 'react-toastify'
const FIVE_MB =(5*1024*1024)

const App = () => {
  const Choosefile = (e) => {
    const file = e.target.files[0]
    if(!file.type.startsWith('image/')) 
    return  toast.error('Please select an image file',{position:'top-center'})
      
    if(file.size > FIVE_MB) 
      return toast.error('File size should be less than 5MB',{position:'top-center'})
    
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-9/12 mx-auto py-10 space-y-8">
        <h1 className="text-3xl text-center font-bold text-gray-800">
          Image Uploader
        </h1>

        <div className="relative w-8/12 mx-auto">
          <button className="hover:scale-105 cursor-pointer transition-transform duration-300 hover:shadow-lg py-10 w-full flex flex-col border-2 border-dashed border-black items-center justify-center gap-3 text-white from-indigo-400 to-fuchsia-400 bg-gradient-to-br rounded-xl relative">
            <Upload className="w-16 h-16" />
            <h1 className="text-xl font-medium">
              Click me to add an Image
            </h1>
          </button>

          {/* File Input Overlay */}
          <input
            type="file"
            onChange={Choosefile}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default App
