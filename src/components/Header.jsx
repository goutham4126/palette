'use client'
import { IoMdRefresh } from 'react-icons/io'
import { FiDownload } from 'react-icons/fi'

export const Header = ({ clearHistory, handleDownload }) => (
  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
    <h1 className="text-xl font-bold">Palette</h1>
    <div className="flex gap-4">
      <IoMdRefresh 
        className="h-6 w-6 cursor-pointer hover:scale-110 transition"
        onClick={clearHistory}
      />
      <FiDownload 
        className="h-6 w-6 cursor-pointer hover:scale-110 transition"
        onClick={handleDownload}
      />
    </div>
  </div>
)