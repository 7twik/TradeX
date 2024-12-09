import { Button } from "@/components/ui/button"
import { FileText, ExternalLink } from 'lucide-react'

export default function Hero() {
  return (
    <div id="launch" className="min-h-screen flex flex-col items-center justify-center bg-black px-4 py-20">
      <h1 className="text-center">
        
        <span className="text-4xl md:text-6xl lg:text-7xl font-bold text-white block">
        Welcome to
        </span>
        <span className="heroText text-4xl md:text-6xl lg:text-9xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text block mb-4">
          Trade-X
        </span>
      </h1>
      
      <p className="mt-6 text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl text-center">
        The library that forms the beating heart of the financial web.
      </p>
      
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          size="lg"
          className="bg-transparent rounded-md border-gray-700 hover:bg-gray-900 text-white min-h-[60px] min-w-[240px] relative group"
        >
          <div>
            <div className="text-base sm:text-lg bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent font-semibold">
              Get the library
            </div>
            <div className="text-sm text-gray-400">Contact us</div>
          </div>
          <FileText className="w-4 h-4 absolute right-4 text-gray-400 transition-transform group-hover:translate-x-1" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="bg-transparent rounded-md border-gray-700 hover:bg-gray-900 text-white min-h-[60px] min-w-[240px] relative group"
        >
          <div>
            <div className="text-base sm:text-lg bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent font-semibold">
              Documentation
            </div>
            <div className="text-sm text-gray-400">Start the integration</div>
          </div>
          <ExternalLink className="w-4 h-4 absolute right-4 text-gray-400 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  )
}
