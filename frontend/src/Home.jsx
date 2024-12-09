import { ReactLenis } from "lenis/dist/lenis-react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import Im1 from "./assets/im1.jpeg";
import { SiSpacex } from "react-icons/si";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { useRef } from "react";
import After from "./After";
import Sec3 from "./Sec3";
import Hero2 from "./Hero";
import Suggestion from "./Suggestion";
import Footer from "./Footer";
export const Home = () => {
  return (
    <div className="bg-zinc-950">
      <ReactLenis
        root
        options={{
          // Learn more -> https://github.com/darkroomengineering/lenis?tab=readme-ov-file#instance-settings
          lerp: 0.05,
          //   infinite: true,
          //   syncTouch: true,
        }}
      >
        <Nav />
        <Hero />
        <Hero2 /> 
        <Suggestion />
        <After />
        <Sec3 />
        <Footer />
      </ReactLenis>
    </div>
  );
};

const Nav = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-3 text-white">
      <SiSpacex className="text-3xl mix-blend-difference" />
      <button
        onClick={() => {
          // document.getElementById("launch")?.scrollIntoView({
          //   behavior: "smooth",
          // });
          window.location.href = "/analysis";
        }}
        className="flex items-center gap-1 text-xs text-zinc-400"
      >
        LAUNCH SCHEDULE <FiArrowRight />
      </button>
    </nav>
  );
};

const SECTION_HEIGHT = 1500;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage />

      <ParallaxImages />

      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </div>
  );
};

const CenterImage = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

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

  return (
    <>
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage:
          "url(https://static.tradingview.com/static/bundles/chart.f45b5f597f15445c9413.svg)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
    <div className="tophead absolute z-100 left-1/2 top-80 -translate-x-1/2 md:text-nowrap text-white font-extrabold text-center">
    Elevate your trading journey
 <br/>
  <button
  className="text-sm top-0"
    onClick={()=>{
      const element = document.getElementById("launch");
      if (element) {
        smoothScroll(element);
      }
    }}
  ><img className="w-40" src="https://dubaiastronomy.com/wp-content/uploads/2020/10/Scroll-Down-white.gif" /></button>
</div>
    </>
  );
};

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxVid
        src="https://static.tradingview.com/static/bundles/flexible-styling.avc1.c2654ac0bf86c6c6ac61.mp4"
        alt="And example of a space launch"
        start={-200}
        end={200}
        className="w-1/3"
      />
      <ParallaxImg
        src="https://static.tradingview.com/static/bundles/interactive.3a91fa6629cc461e8edc.webp"
        alt="An example of a space launch"
        start={200}
        end={-250}
        className="mx-auto w-2/3"
      />
      <ParallaxVid
        src="https://static.tradingview.com/static/bundles/indicators.avc1.6a6cc0aea6d2e5b9f460.mp4"
        alt="Orbiting satellite"
        start={-200}
        end={200}
        className="ml-auto w-1/3"
      />
      <ParallaxImg
        src="https://static.tradingview.com/static/bundles/chart-types.9fad8d43a51022308c28.svg"
        alt="Orbiting satellite"
        start={0}
        end={-500}
        className="ml-24 w-5/12"
      />
    </div>
  );
};

const ParallaxImg = ({ className, alt, src, start, end }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
};

const ParallaxVid = ({ className, alt, src, start, end }) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.div
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full"
        src={src}
      />
    </motion.div>
  );
};

