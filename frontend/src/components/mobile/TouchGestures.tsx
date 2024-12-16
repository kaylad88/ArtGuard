import React from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';

export const TouchableGallery: React.FC = () => {
  const x = useMotionValue(0);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      // Handle swipe
      console.log(info.offset.x > 0 ? 'swiped right' : 'swiped left');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden touch-none">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, scale, rotate }}
        onDragEnd={handleDragEnd}
        className="w-full h-full bg-white dark:bg-dark-200 rounded-2xl"
      >
        {/* Content */}
      </motion.div>
    </div>
  );
};
