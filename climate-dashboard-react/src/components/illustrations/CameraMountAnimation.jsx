// src/components/illustrations/CameraMountAnimation.jsx

import { useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import ChevronDown from "@/images/assets/chevron-down.svg";

import post from "../../images/assets/mount/post.svg";
import horizontal from "../../images/assets/mount/horizontal.svg";
import vertical from "../../images/assets/mount/vertical.svg";
import camera from "../../images/assets/mount/camera.svg";

export default function CameraMountAnimation({ replayOnScroll = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: !replayOnScroll, amount: 0.5 });
  const controls = useAnimation();

  // Play when scrolled into view
  if (isInView) {
    controls.start("visible");
  }

  const transition = { duration: 0.8, ease: "easeOut" };

  const replay = () => {
    controls.set("hidden");
    controls.start("visible");
  };

  return (
    <div ref={ref} className="mx-auto w-[195px]">

      {/* Illustration */}
      <div className="relative">

        {/* Base post */}
        <img
          src={post}
          alt="Mount post"
          className="relative z-10 w-full"
          draggable={false}
        />

        {/* Horizontal block */}
        <motion.img
          src={horizontal}
          alt="Horizontal mount"
          className="absolute z-20"
          style={{ top: "154px", left: "-25px" }}
          variants={{
            hidden: { x: -120, opacity: 0 },
            visible: { x: 8, opacity: 1 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ ...transition, delay: 0.4 }}
          draggable={false}
        />

        {/* Vertical block */}
        <motion.img
          src={vertical}
          alt="Vertical mount"
          className="absolute z-40"
          style={{ top: "118px", left: "46px" }}
          variants={{
            hidden: { x: -80, y: 40, opacity: 0 },
            visible: { x: 0, y: 0, opacity: 1 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ ...transition, delay: 1.2 }}
          draggable={false}
        />

        {/* Camera */}
        <motion.img
          src={camera}
          alt="Camera"
          className="absolute z-30"
          style={{ top: "10px", left: "-72px" }}
          variants={{
            hidden: { x: -130, y: 10, opacity: 0 },
            visible: { x: 0, y: 0, opacity: 1 },
          }}
          initial="hidden"
          animate={controls}
          transition={{ ...transition, delay: 2.0 }}
          draggable={false}
        />
      </div>

      {/* Replay button (styled like your toggles) */}
      <button
  onClick={replay}
  className="mt-6 flex items-center gap-3 mx-auto focus:outline-none group"
>
  <span className="text-teal-400 text-sm font-light group-hover:text-teal-300 transition-colors">
    Replay animation
  </span>
</button>
    </div>
  );
}


