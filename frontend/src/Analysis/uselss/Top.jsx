import { useState } from 'react'
import React from 'react' 
import axios from 'axios'
//import { createChart } from 'lightweight-charts';

const Top = (props) => {
    const [data, setData] = useState([])

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
      console.log(noteInv)
      for(let i=0;i<data.length;i++){
        if(data[i].Ticker===noteInv){
          flag=1;
          break;
        }
      }
      if(flag===1){
        props.month(month)
        props.name(noteInv)
        const response = await axios.get('http://localhost:5000/api/ml2', {params: {name: noteInv, month: month}})
        console.log(response.data)
        props.data(response.data.data,response.data.info)

      }
      else{
        alert("Invalid Stock Name")
      }
    }
 
      const [noteInv, setNoteInv] = useState('')
      const handleChangeInvy=(e)=>{
        console.log(e.target.value)
        setNoteInv(e.target.value)
      }
  
      const [month, setMonth] = useState(0)
      const monthchange=(e)=>{
        console.log(e.target.value)
        setMonth(e.target.value)
      }
      
  return (
    <>
    Choose a stock from given List:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    

    <input
      list="data"
      name="Name"
      onChange={handleChangeInvy}
      value={noteInv}
      placeholder="Search"
    />
    <datalist id="data">
      {data.length === 0 ? (
        <></>
      ) : (
        data.map((op, index) => (
          <div className="item" key={index}>
            <option value={op.Ticker} key={index}>
              {op.Name}
            </option>
          </div>
        ))
      )}
    </datalist>
    <input type="number" placeholder="Enter number of month" onChange={monthchange}></input>
    <button onClick={getStockData}>click</button>
    
    </>
  )
}

export default Top