import React, {useState } from 'react'
import StockSelector from './StockSelector'
import Sidebar from './Sidebar'
import { Button } from '@/components/ui/button'
import { MenuIcon, ChevronRight } from 'lucide-react'
import Candlechar from './Candlechar'

import News from './News'
import Strategy from './Strategy'
import Suggestion from '@/Suggestion'

export default function All() {

    const [pastData, setPastData] = useState([])
        const [alldata, setAlldata] = useState([])
        const datafound= async(data,data2)=>{
          setAlldata(data2)
          console.log(data)
          setPastData(data)
        }
        const [month, setMonth] = useState(0)
        const changemonth= async(month)=>{
            console.log(month)
            setMonth(month)
        }
        const [name, setName] = useState('')
        const changename= async(name)=>{
            console.log(name)
            setName(name)
        }
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  const [newss, setNews] = React.useState([])
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleStockSelection = (stock) => {
    setSelectedStock(stock)
    setSidebarOpen(true)
  }
  const [strategy, setStrategy] = useState(null)
  const getNews = async () => {
    var res=await fetch("http://localhost:5000/api/news?tick="+selectedStock)
    res=await res.json()
    console.log(res.data)
    setNews(res.data);

  }
  const getStrategy = async () => {
    var res=await fetch("http://localhost:5000/api/strategy?tick="+selectedStock+"&month="+month+"&name="+name)
    res=await res.json()
    console.log(res)
    setStrategy(res);
  }
  React.useEffect(() => {
    if(selectedStock!==null){
      getNews()
      getStrategy()
    }

  },[selectedStock])
  return (
    <div id="analytics" className="flex bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <h1 className="text-2xl font-bold">Stock Dashboard {selectedStock}</h1>
          <Button variant="outline" size="icon" onClick={toggleSidebar} className="md:hidden">
            <MenuIcon className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 flex flex-col md:flex-row">
          <div className={`flex-1 p-4 ${sidebarOpen ? 'md:mr-64' : ''}`}>
            <StockSelector data={datafound} month={changemonth} name={changename} onSelectStock={handleStockSelection} />
            <div className="mt-8 bg-white p-4 rounded-lg shadow">
             
            {selectedStock==null?
              <div className={`w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg `}>
                <p className="text-gray-500">Graph Placeholder</p>
              </div>:
              <div className="w-full h-full">
                <Candlechar past={pastData} month={month} name={name} />
              </div>
            }

            <div className="w-[95vw] overflow-x-hidden">
                {(strategy==null||strategy==undefined)?<></>:<Strategy data={strategy} name={name} />}
                {(newss.length==0||newss==null||newss==undefined||newss.error)?<></>:<News data={newss} />}
            </div>
            </div>
          </div>
          <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} stockData={alldata} />
        </main>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className={`fixed bottom-4 right-4 ${!sidebarOpen && selectedStock ? 'md:flex' : 'hidden'}`}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
    </div>
  )
}