import React from "react"
import "animate.css"
import { Download, Upload, Trash2 } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import { useImgstore } from "./store/useImgstore"

const FIVE_MB = 5 * 1024 * 1024

const App = () => {
  const { images, setImages,deleteImg } = useImgstore()

  const Choosefile = (e) => {
    const file = e.target.files[0]
    if (!file?.type.startsWith("image/"))
      return toast.error("Please select an image file", {
        position: "top-center",
      })

    if (file.size > FIVE_MB)
      return toast.error("File size should be less than 5MB", {
        position: "top-center",
      })

    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      setImages({
        id: Date.now(),
        name: file.name,
        size: file.size,
        binary: fileReader.result,
        createdAt: new Date().toLocaleString(),
      })
      toast.success("Image uploaded successfully", { position: "top-center" })
    }
  }

  const handleDownload = (item) => {
    const link = document.createElement("a")
    link.href = item.binary
    link.download = item.name
    link.click()
    a.remove()
  }

  

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="w-10/12 lg:w-8/12 mx-auto py-12 space-y-10">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center text-gray-800 animate__animated animate__fadeInDown">
          📸 Image Uploader
        </h1>

        {/* Upload Box */}
        <div className="relative">
          <label className="cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300 hover:shadow-xl py-12 w-full flex flex-col border-2 border-dashed border-gray-400 items-center justify-center gap-4 text-white from-indigo-400 to-fuchsia-500 bg-gradient-to-br rounded-2xl">
            <Upload className="w-16 h-16 animate__animated animate__pulse animate__infinite" />
            <span className="text-xl font-medium">Click to upload an Image</span>
            <input
              type="file"
              onChange={Choosefile}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Uploaded Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {images.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <img
                  src={item.binary}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4 space-y-2">
                  <h2 className="font-semibold text-gray-800 truncate">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {((item.size / 1024) / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-gray-400">{item.createdAt}</p>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleDownload(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" /> 
                    </button>
                    <button
                      onClick={() => deleteImg(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> 
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  )
}

export default App
