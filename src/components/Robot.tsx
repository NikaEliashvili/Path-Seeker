import React from 'react';
import { motion } from 'framer-motion';
import { Position } from '../types';
import { CELL_SIZE, ROBOT_SIZE, MOVE_ANIMATION_DURATION } from '../constants';
import { Notebook as RobotIcon } from 'lucide-react';

interface RobotProps {
  position: Position;
  isMoving: boolean;
  hasReachedGoal: boolean;
}

const Robot: React.FC<RobotProps> = ({ position, isMoving, hasReachedGoal }) => {
  // Calculate robot position in pixels
  const x = position[1] * CELL_SIZE + (CELL_SIZE - ROBOT_SIZE) / 2;
  const y = position[0] * CELL_SIZE + (CELL_SIZE - ROBOT_SIZE) / 2;

  return (
    <motion.div
      className="absolute z-10"
      initial={{ x, y, rotate: 0 }}
      animate={{ 
        x, 
        y,
        rotate: isMoving ? [0, 15, -15, 0] : 0,
        scale: hasReachedGoal ? [1, 1.2, 1] : 1
      }}
      transition={{ 
        x: { duration: MOVE_ANIMATION_DURATION, ease: "easeInOut" },
        y: { duration: MOVE_ANIMATION_DURATION, ease: "easeInOut" },
        rotate: { 
          duration: MOVE_ANIMATION_DURATION,
          repeat: isMoving ? 1 : 0,
          ease: "easeInOut"
        },
        scale: {
          duration: 0.5,
          repeat: hasReachedGoal ? Infinity : 0,
          repeatType: "reverse"
        }
      }}
    >
      <div 
        className={`flex items-center justify-center w-[${ROBOT_SIZE}px] h-[${ROBOT_SIZE}px] rounded-full text-white`}
      >
        <RobotIcon 
          size={ROBOT_SIZE} 
          className={`${hasReachedGoal ? 'text-yellow-400' : 'text-yellow-400'}`}
        />
      </div>
    </motion.div>
  );
};

export default Robot;