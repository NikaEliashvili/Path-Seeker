import { motion } from "framer-motion";

export const RobotSVG = () => {
  return (
    <motion.div
      className="flex items-center justify-center "
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <div className="w-10 h-14 relative drop-shadow-md ">
        {/* Head */}
        <div className="w-6 h-6 bg-gray-800 rounded-full absolute left-2 top-0 flex justify-center items-center shadow-md outline-dashed outline-1 outline-white/80 ">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Body */}
        <div className="w-10 h-7 bg-gray-700 rounded-lg absolute top-6 left-0 shadow-inner outline-dashed outline-1 outline-white/80" />

        {/* Arms */}
        <div className="absolute top-7 left-[-9px] w-2 h-6 bg-gray-600 rounded outline-dashed outline-1 outline-white/80" />
        <div className="absolute top-7 right-[-9px] w-2 h-6 bg-gray-600 rounded outline-dashed outline-1 outline-white/80" />

        {/* Legs */}
        <motion.div
          className="absolute bottom-[-18px] left-2 w-2 h-6 bg-gray-600 rounded outline-dashed outline-1 outline-white/80"
          animate={{ y: [0, -2, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[-18px] right-2 w-2 h-6 bg-gray-600 rounded outline-dashed outline-1 outline-white/80"
          animate={{ y: [0, 2, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
      </div>
    </motion.div>
  );
};
