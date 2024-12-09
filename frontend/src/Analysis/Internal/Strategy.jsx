import { ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'
import { motion, useTransform, useScroll } from "framer-motion";
import React, { useRef } from 'react'
import Bear from '../../assets/bear.jpeg'
import Bull from '../../assets/bull.jpeg'
import Hold from '../../assets/hold.jpeg'
function StrategyBox({ name, value }) {
    const strategyFullNames = {
        ATR: 'Average True Range',
        BBS: 'Bollinger Bands',
        EMA: 'Exponential Moving Avg',
        MAC: 'Moving Avg Convergence',
        RSIS: 'Relative Strength Index',
        Stochastic: 'Stochastic Oscillator'
      }
    let color = 'bg-yellow-100'
    let icon = <ArrowRight className="h-8 w-8 text-yellow-500" />
    let text = 'Hold'
      let src=Hold
    if (value === 1) {
      color = 'bg-green-100'
      icon = <ArrowUp className="h-8 w-8 text-green-500" />
      src=Bull
      text = 'Buy'
    } else if (value === -1) {
        src=Bear
      color = 'bg-red-100'
      icon = <ArrowDown className="h-8 w-8 text-red-500" />
      text = 'Sell'
    }
  
    return (
      <div className={`transition-all duration-300 relative rounded-lg container2 shadow-md ${color}`}>
         <div className="absolute inset-0 transition-transform duration-300 pointer-events-none" />
        <h3 className="p-4 text-lg font-semibold mb-2 text-center text-nowrap">{strategyFullNames[name]}</h3>
        <span className="flex justify-center items-center">{text} {icon}</span>
        <div className="flex flex-col items-center">
            <img src={src} className="w-full" />
        </div>
      </div>
    )
  }
  
  function StrategySc({ data,name }) {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
      target: targetRef,
    });
  
    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);
    return (
      
        <section ref={targetRef} className="relative h-[150vh]">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden">
            <motion.div style={{ x }} className="flex gap-4">
              {(Object.keys(data).map((strategy) => {
                return <StrategyBox key={strategy} name={strategy} value={data[strategy]} />
              }))}
            </motion.div>
          </div>
        </section>
    )
  }
  export default function Strategy({ data,name }){
    return (
      <section id="strategy" className="container mx-auto px-4 py-8">
        <h2 className="text-6xl font-bold mb-6 text-center">Strategy Dashboard {name}</h2>
        <StrategySc data={data} name={name} />
      </section>
    )
  }