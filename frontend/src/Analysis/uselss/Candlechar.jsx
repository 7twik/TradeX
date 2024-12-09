import React,{useRef,useEffect} from 'react'
import { createChart, ColorType, CrosshairMode , LineStyle } from 'lightweight-charts';
import axios from 'axios'
const Char = (props) => {
    
    const chartContainerRef=useRef();
    const [candle, setCandle] = React.useState(-1)
    const [line, setLine] = React.useState(-1)
    const [area, setArea] = React.useState(-1)
    const [histogram, setHistogram] = React.useState(-1)
    const [bar, setBar] = React.useState(-1)
    const [baseline, setBaseline] = React.useState(-1)
    const [alldata, setallData] = React.useState([])
    const [average, setAverage] = React.useState(0)
    const [semidata, setSemidata] = React.useState([])
    const [state, setState] = React.useState(0)
    const [col,setcol]=React.useState(0)
    const changecol=(e)=>{
        setcol(e.target.value)
    }
    const [arr,setarr]=React.useState([])
    function generateRandomColor() {
        // Generate a random hex color code
        const colorCode = Math.floor(Math.random()*16777215).toString(16);
        
        // Ensure the color code has 6 digits
        return "#" + "0".repeat(6 - colorCode.length) + colorCode;
      }
    const getCloseAvg=async()=>{
        console.log(props.month)
        let months=Number(props.month)+Number(Math.ceil(col/22))
        console.log(months)
        let name=props.name
        const response = await axios.get('http://localhost:5000/api/ml2', {params: {name: name, month: months}})
        let total=await response.data.data;
        console.log(total)
        let s=0;
        for(let i=0;i<total.length;i++){
            if(total[i].Date===props.past[0].Date){
                s=Number(i);
                console.log(i)
                break;
            }
        }
        let end=Number(s);
        s-=Number(col);
        let sum=Number(0);
        let cnt=0;
        for(let i=s;i<=end;i++){
            cnt++;
            sum+=Number(total[i].Close);
        }
        console.log(sum)
        let newd=[];
        let colour=generateRandomColor();
        console.log(Number(s)+Number(col)+Number(semidata.length))
        for(let i=0;i<semidata.length;i++){
            console.log(sum)
            newd.push({time:semidata[i].time,value:(Number(sum)/Number(cnt))})
            sum-=Number(total[Number(s)].Close);
            // console.log(total[s].Close)
            sum+=Number(total[Number(s)+Number(col)].Close);
            
            s=Number(s)+1;
        }

        setarr([...arr,{check:1, data:newd, color:colour, day:col, type:"Close"}]);
      }

      const getOpenAvg=async()=>{
        console.log(props.month)
        let months=Number(props.month)+Number(Math.ceil(col/22))
        console.log(months)
        let name=props.name
        const response = await axios.get('http://localhost:5000/api/ml2', {params: {name: name, month: months}})
        let total=await response.data.data;
        console.log(total)
        let s=0;
        for(let i=0;i<total.length;i++){
            if(total[i].Date===props.past[0].Date){
                s=Number(i);
                console.log(i)
                break;
            }
        }
        let end=Number(s);
        s-=Number(col);
        let sum=Number(0);
        let cnt=0;
        for(let i=s;i<=end;i++){
            cnt++;
            sum+=Number(total[i].Close);
        }
        console.log(sum)
        let newd=[];
        let colour=generateRandomColor();
        console.log(Number(s)+Number(col)+Number(semidata.length))
        for(let i=0;i<semidata.length;i++){
            console.log(sum)
            newd.push({time:semidata[i].time,value:(Number(sum)/Number(cnt))})
            sum-=Number(total[Number(s)].Open);
            // console.log(total[s].Close)
            sum+=Number(total[Number(s)+Number(col)].Open);
            
            s=Number(s)+1;
        }

        setarr([...arr,{check:1, data:newd, color:colour, day:col, type:"Open"}]);
      }

      const getHighAvg=async()=>{
        console.log(props.month)
        let months=Number(props.month)+Number(Math.ceil(col/22))
        console.log(months)
        let name=props.name
        const response = await axios.get('http://localhost:5000/api/ml2', {params: {name: name, month: months}})
        let total=await response.data.data;
        console.log(total)
        let s=0;
        for(let i=0;i<total.length;i++){
            if(total[i].Date===props.past[0].Date){
                s=Number(i);
                console.log(i)
                break;
            }
        }
        let end=Number(s);
        s-=Number(col);
        let sum=Number(0);
        let cnt=0;
        for(let i=s;i<=end;i++){
            cnt++;
            sum+=Number(total[i].Close);
        }
        console.log(sum)
        let newd=[];
        let colour=generateRandomColor();
        console.log(Number(s)+Number(col)+Number(semidata.length))
        for(let i=0;i<semidata.length;i++){
            console.log(sum)
            newd.push({time:semidata[i].time,value:(Number(sum)/Number(cnt))})
            sum-=Number(total[Number(s)].High);
            // console.log(total[s].Close)
            sum+=Number(total[Number(s)+Number(col)].High);
            
            s=Number(s)+1;
        }

        setarr([...arr,{check:1, data:newd, color:colour, day:col, type:"High"}]);
      }

      const getLowAvg=async()=>{
        console.log(props.month)
        let months=Number(props.month)+Number(Math.ceil(col/22))
        console.log(months)
        let name=props.name
        const response = await axios.get('http://localhost:5000/api/ml2', {params: {name: name, month: months}})
        let total=await response.data.data;
        console.log(total)
        let s=0;
        for(let i=0;i<total.length;i++){
            if(total[i].Date===props.past[0].Date){
                s=Number(i);
                console.log(i)
                break;
            }
        }
        let end=Number(s);
        s-=Number(col);
        let sum=Number(0);
        let cnt=0;
        for(let i=s;i<=end;i++){
            cnt++;
            sum+=Number(total[i].Close);
        }
        console.log(sum)
        let newd=[];
        let colour=generateRandomColor();
        console.log(Number(s)+Number(col)+Number(semidata.length))
        for(let i=0;i<semidata.length;i++){
            console.log(sum)
            newd.push({time:semidata[i].time,value:(Number(sum)/Number(cnt))})
            sum-=Number(total[Number(s)].Low);
            // console.log(total[s].Close)
            sum+=Number(total[Number(s)+Number(col)].Low);
            
            s=Number(s)+1;
        }

        setarr([...arr,{check:1, data:newd, color:colour, day:col,type:"Low"}]);
      }

    useEffect(()=>{
        if(props.past.length===0){
            setState(0)
        }
        else{
            
            let sum=0;
            let count=0;
            let alldat=props.past.map((item)=>{
                sum+=item.Close;
                count++;
                // Create a new Date object from the input string
                var inputDate = new Date(item.Date);

                // Get the year, month, and day components
                var year = inputDate.getUTCFullYear();
                var month = String(inputDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
                var day = String(inputDate.getUTCDate()).padStart(2, '0');

                // Create the yyyy-mm-dd format string
                var formattedDate = `${year}-${month}-${day}`;
            return {time:formattedDate,close:item.Close,open:item.Open,high:item.High,low:item.Low}});
            setallData(alldat)
            setAverage(sum/count)
            setSemidata(alldat.map((item)=>{
                return {time:item.time,value:item.close}
            }))
           
            
            setState(1)
    }
    },[props.past])
    
    const renderChart = () => {
        const chart = createChart(chartContainerRef.current, {
            layout: {
                type: ColorType.Solid,
                backgroundColor: 'black',
            } ,
            width:1370,
            height:550
        });
    
        if (candle>0) {
          const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        });
          candlestickSeries.setData(alldata);
        }
    
        if (bar>0) {
          const barSeries = chart.addBarSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
            });
          
            barSeries.setData(alldata);
        }

        if(line>0){
            const lineSeries = chart.addLineSeries({ color: '#2962FF' });
            lineSeries.setData(semidata);
        }
        if(area>0){
            const areaSeries = chart.addAreaSeries({
                lineColor: '#2962FF',
                topColor: '#2962FF',
                bottomColor: 'rgba(41, 98, 255, 0.28)',
            });
            areaSeries.setData(semidata);
        }
        if(histogram>0){
            const histogramSeries = chart.addHistogramSeries({ color: '#2962FF', lineWidth: 2 });
            histogramSeries.setData(semidata);
        }
        if(baseline>0){
            const newSeries = chart.addBaselineSeries({ baseValue: { type: 'price', price: average }, 
            topLineColor: 'rgba( 38, 166, 154, 1)', 
            topFillColor1: 'rgba( 38, 166, 154, 0.28)', 
            topFillColor2: 'rgba( 38, 166, 154, 0.05)', 
            bottomLineColor: 'rgba( 239, 83, 80, 1)', 
            bottomFillColor1: 'rgba( 239, 83, 80, 0.05)', 
            bottomFillColor2: 'rgba( 239, 83, 80, 0.28)' 
            });
            newSeries.setData(semidata);
        }
        if(arr.length>0){
            for(let i=0;i<arr.length;i++){
                if(arr[i].check>0){
                    const newSeries = chart.addLineSeries({ color: arr[i].color });
                    newSeries.setData(arr[i].data);
                }
            }
        }
        chart.applyOptions({
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    width: 8,
                    color: '#C3BCDB44',
                    style: LineStyle.Solid,
                    labelBackgroundColor: '#9B7DFF',
                },
                horzLine: {
                    color: '#9B7DFF',
                    labelBackgroundColor: '#9B7DFF',
                },
            },
        });
        
      chart.timeScale().applyOptions({
        barSpacing: 10,
      });
      };
    
      useEffect(() => {
        if (chartContainerRef.current) {
          // Clear the container before re-rendering
          chartContainerRef.current.innerHTML = '';
          renderChart();
        }
      }, [candle, line,area,histogram,bar,baseline,props.past,arr]);
    

    const changestate=(index)=>{
        let newarr=arr;
        newarr[index].check=newarr[index].check*-1;
        setarr(newarr);
        if (chartContainerRef.current) {
            // Clear the container before re-rendering
            chartContainerRef.current.innerHTML = '';
            renderChart();
          }
    }
    const [movavgopt, setmovavgopt] = React.useState('Close')
    const changemovavg=(e)=>{
        setmovavgopt(e.target.value)
    }
    const getAvg=()=>{
        if(movavgopt==="Close"){
            getCloseAvg();
        }
        else if(movavgopt==="Open"){
            getOpenAvg();
        }
        else if(movavgopt==="High"){
            getHighAvg();
        }
        else if(movavgopt==="Low"){
            getLowAvg();
        }
    }
    
  return (
    <div className='flex flex-col'>
    {state==0?<></>:
        <div>
            <button style={(candle>0)?{background:"white",color:"black"}:{background:"black",color:"white"}} onClick={()=>{setCandle(candle*-1)}}>candle</button> 
            <button style={(line>0)?{background:"white",color:"black"}:{background:"black",color:"white"}} onClick={()=>{setLine(line*-1)}}>Line </button> 
            <button style={(area>0)?{background:"white",color:"black"}:{background:"black",color:"white"}} onClick={()=>{setArea(area*-1)}}> Area</button>
            <button style={(histogram>0)?{background:"white",color:"black"}:{background:"black",color:"white"}} onClick={()=>{setHistogram(histogram*-1)}}> Histogram </button> 
            <button style={(bar>0)?{background:"white",color:"black"}:{background:"black",color:"white"}} onClick={()=>{setBar(bar*-1)}}> Bar </button> 
            <button style={(baseline>0)?{background:"white",color:"black"}:{background:"black",color:"white"}} onClick={()=>{setBaseline(baseline*-1)}}> Baseline </button>
            <input type="number" placeholder="enter moving average in days" onChange={changecol} />
            <select value={movavgopt} onChange={changemovavg}>
                <option value="Close">Close</option>
                <option value="Open">Open</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
            </select>
            <button onClick={getAvg}>Get Data</button>
            <br/>
            {arr.length===0?<></>:<div>
            {arr.map((item,index)=><button key={index} style={(item.check>0)?{background:item.color,color:"black"}:{background:"black",color:"white"}} onClick={()=>{changestate(index)}}>
                {item.day} day [ {item.type} ] moving average </button>
        )}</div>}
        </div>}
        <div ref={chartContainerRef}></div>
  
    </div>
  )
}

export default Char