import React,{ useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'

{/* eslint-disable-next-line react/prop-types  */}
export default function StockSelector({ onSelectStock,month,name,data}) {
  const [selectedStock, setSelectedStock] = useState('')
  const [months, setMonths] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedStock) {
      onSelectStock(selectedStock)
    }
  }
  const [dat, setData] = useState([])
  const handleChangeInvy=(e)=>{
    console.log(e.target.value)
    setSelectedStock(e.target.value)
  }
    const getData2= async()=>{
      const response = await fetch('http://localhost:3000/api/stocknameind')
      const dataa = await response.json()
      setData(dataa)
      console.log(dataa)
    }
    React.useEffect(() => {
      getData2();
      }, [])

      const getStockData= async()=>{
        let flag=0;
        console.log(selectedStock)
        for(let i=0;i<dat.length;i++){
          if(dat[i].Ticker===selectedStock){
            flag=1;
            break;
          }
        }
        if(flag===1){
          month(months)
          name(selectedStock)
          const response = await axios.get('http://localhost:5000/api/ml2', {params: {name: selectedStock, month: months}})
          console.log(response.data)
          data(response.data.data,response.data.info)
  
        }
        else{
          alert("Invalid Stock Name")
        }
      }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
       
            
            <input
                list="data"
                className='pl-2'
                name="Name"
                onChange={handleChangeInvy}
                value={selectedStock}
                placeholder="Search"
                />
            <datalist id="data">
                {dat.length === 0 ? (
                    <></>
                ) : (
                    dat.map((op, index) => (
                    <div className="item" key={index}>
                        <option value={op.Ticker} key={index}>
                        {op.Name}
                        </option>
                    </div>
                    ))
                )}
            </datalist>

            
        <Input
          type="number"
          placeholder="Enter months"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          className="w-full md:w-[200px]"
        />
        <Button  onClick={getStockData} type="submit" className="w-full md:w-auto">Enter</Button>
      </div>
    </form>
  )
}
