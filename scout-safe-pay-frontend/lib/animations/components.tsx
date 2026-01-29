import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from './variants';

interface PageProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const PageTransition: React.FC<PageProps> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={fadeInUp}
    transition={{ delay }}
  >
    {children}
  </motion.div>
);

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerContainer: React.FC<ContainerProps> = ({ children, className = '' }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-100px' }}
    variants={staggerContainer}
  >
    {children}
  </motion.div>
);

interface ItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<ItemProps> = ({ children, className = '' }) => (
  <motion.div className={className} variants={staggerItem}>
    {children}
  </motion.div>
);
