import { useState } from "react";
import {
  FiBarChart,
  FiChevronDown,
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiUsers,
} from "react-icons/fi";
import { RiStockFill } from "react-icons/ri";
import { FaRegNewspaper } from "react-icons/fa";
import {
  PiStrategy 
} from "react-icons/pi";
import { motion } from "framer-motion";
import All from "./Internal/All";

export const LeftSidebar = () => {
  return (
    <div className="actual-receipt">
        <div className="flex bg-indigo-50">
            <Sidebar />
            <div className="w-full">
                    <All />
            </div>
        </div>
    </div>
  );
};

const Sidebar = () => {
  const smoothScroll = (element) => {
    const targetPosition = element.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 3000; // Duration in milliseconds (increase this for slower scroll)
    let start = null;
  
    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeInOutCubic = progress => {
        return progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      };
  
      window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
  
      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };
  
    requestAnimationFrame(animation);
  };
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  function movetohome(){
    window.location.href = "/";
  }
  function movetonews(){
    const element = document.getElementById("news");
      if (element) {
        smoothScroll(element);
      }
  }
  function movetostrategy(){
    const element = document.getElementById("strategy");
      if (element) {
        smoothScroll(element);
      }
  }
  function movetoanalytics(){
    const element = document.getElementById("analytics");
      if (element) {
        smoothScroll(element);
      }
  }
  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2 hide"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
        <Option
          Icon={FiHome}
          title="Homepage"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onclick={movetohome}
        />
        <Option
          Icon={PiStrategy}
          title="Strategy"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onclick={movetostrategy}
        />
         <Option
          Icon={FiBarChart}
          title="Analytics"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onclick={movetoanalytics}
        />
        <Option
          Icon={FaRegNewspaper}
          title="News"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onclick={movetonews}
        />        
        <Option
          Icon={FiDollarSign}
          title="Income Statement"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onclick={movetohome}
        />
       
        <Option
          Icon={FiUsers}
          title="Shares"
          selected={selected}
          setSelected={setSelected}
          open={open}
          onclick={movetohome}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

// eslint-disable-next-line react/prop-types
const Option = ({ Icon, title, selected, setSelected, open, notifs, onclick }) => {
  return (
    <motion.button
      layout
      onClick={() =>{ setSelected(title)
        onclick()}
      }
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title ? "bg-indigo-100 text-indigo-800" : "text-slate-500 hover:bg-slate-100"}`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

// eslint-disable-next-line react/prop-types
const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3" >
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs font-semibold">Stock Dashboard</span>
              <span className="block text-xs text-slate-500">Pro Plan</span>
            </motion.div>
          )}
        </div>
        {open && <FiChevronDown className="mr-2" />}
      </div>
    </div>
  );
};

const Logo = () => {
  // tailwind css background gradient
  // bg-gradient-to-r from-indigo-500 to-indigo-600
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-gradient-to-r from-green-300 to-red-300"
    >
      <RiStockFill className="text-white" />
    </motion.div>
  );
};

// eslint-disable-next-line react/prop-types
const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

