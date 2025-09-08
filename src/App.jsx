import React, { useState } from "react"
import "animate.css"
import { Download, Upload, Trash2, Eye, X } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import { useImgstore } from "./store/useImgstore"
import "react-toastify/dist/ReactToastify.css"

const FIVE_MB = 5 * 1024 * 1024

const App = () => {
  const { images, setImages, deleteImg } = useImgstore()
  const [preview, setPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Handle single file upload
  const handleFile = (file) => {
    if (!file?.type.startsWith("image/"))
      return toast.error("Please select an image file", { position: "top-center" })
    if (file.size > FIVE_MB)
      return toast.error("File size should be less than 5MB", { position: "top-center" })

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImages({
        id: Date.now(),
        name: file.name,
        size: file.size,
        binary: reader.result,
        createdAt: new Date().toLocaleString(),
      })
      toast.success("Image uploaded successfully", { position: "top-center" })
    }
  }

  // Drag & Drop events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleDownload = (item) => {
    const link = document.createElement("a")
    link.href = item.binary
    link.download = item.name
    link.click()
  }

  const handleBulkDownload = () => {
    if (images.length === 0) return
    images.forEach(handleDownload)
  }

  const handleBulkDelete = () => {
    if (images.length === 0) return
    images.forEach((img) => deleteImg(img.id))
  }

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSize = images.reduce((acc, img) => acc + img.size, 0)

  return (
    <div
      className="bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 min-h-screen p-6"
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold text-gray-800 animate__animated animate__fadeInDown">
            📸 Image Uploader Pro
          </h1>
          <p className="text-gray-500">
            Upload, preview, and manage your images effortlessly
          </p>
          <p className="text-gray-400 text-sm">
            Total Images: {images.length} | Total Size: {(totalSize / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* Upload Box */}
        <div className="relative">
          <label
            className={`cursor-pointer hover:scale-[1.02] active:scale-95 transition-all duration-300 py-16 w-full flex flex-col border-2 border-dashed items-center justify-center gap-4 text-gray-700 bg-gradient-to-r from-indigo-100 to-fuchsia-100 rounded-3xl ${
              dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
            }`}
          >
            <Upload className="w-16 h-16 animate__animated animate__pulse animate__infinite text-indigo-500" />
            <span className="text-xl font-medium">
              Click or Drag & Drop to upload an image
            </span>
            <input
              type="file"
              onChange={(e) => handleFile(e.target.files[0])}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Bulk Actions */}
        {images.length > 0 && (
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleBulkDownload}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" /> Download All
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete All
            </button>
          </div>
        )}

        {/* Images Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((item) => (
              <div
                key={item.id}
                className="bg-white/30 backdrop-blur-md rounded-3xl shadow-lg overflow-hidden group relative hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={item.binary}
                  alt={item.name}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onClick={() => setPreview(item.binary)}
                />
                <div className="p-4 space-y-2">
                  <h2 className="font-semibold text-gray-800 truncate">{item.name}</h2>
                  <p className="text-sm text-gray-500">
                    {((item.size / 1024) / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-gray-400">{item.createdAt}</p>

                  <div className="mt-4 flex gap-2">
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
                    <button
                      onClick={() => setPreview(item.binary)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" /> 
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-6">No images found</p>
        )}

        {/* Preview Modal */}
        {preview && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
            onClick={() => setPreview(null)}
          >
            <img src={preview} className="max-h-[80vh] rounded-2xl shadow-2xl" />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-6 right-6 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  )
}

export default App
