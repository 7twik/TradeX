import { motion, useTransform, useScroll } from "framer-motion";
import React, { useRef } from "react";
import { stockTickers } from "./constants/constants";
import StockCard from "./StockCard";
const Suggestion = () => {

    const [data, setData] = React.useState([])

    const getData= async()=>{
        var indexes="^NSEI,^NSEBANK,";
        for(let i=0;i<6;i++){
            //console.log(dataa.length)
            const randomIndex=Math.floor(Math.random()*stockTickers.length);
            //console.log(randomIndex)
            indexes+=stockTickers[randomIndex]+",";
        }
        indexes=indexes.slice(0,-1);
        console.log(indexes)
        getData2(indexes);
      }
      const getData2 = async (ind) => {
        
        // Append 'ind' as a query parameter to the URL
        const response = await fetch(`http://localhost:5000/api/ml3?ind=${encodeURIComponent(ind)}`);
        const dataa = await response.json();
        console.log(dataa);
        setData(dataa.data);
    };
      React.useEffect(() => {
        getData();
        //choose random 6 indexes from this
        
        }, [])

  return (
    <div className="bg-black">
      
      <HorizontalScrollCarousel data={data} />
     
    </div>
  );
};

const HorizontalScrollCarousel = ({data}) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-85%"]);

  return (
    <section ref={targetRef} className="relative h-[200vh] bg-black">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {data.map((card,i) => {
            return <StockCard key={i} stock={card} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Suggestion;