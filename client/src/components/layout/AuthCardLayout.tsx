import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import {
  card,
  footer as footerClass,
  header,
  iconWrap,
  subtitle as subtitleClass,
  title as titleClass,
  wrapper,
} from './AuthCardLayout.css';

export interface AuthCardLayoutProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  error?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
};

export function AuthCardLayout({
  icon,
  title,
  subtitle,
  error,
  children,
  footer,
}: AuthCardLayoutProps) {
  return (
    <motion.section
      className={wrapper}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className={card}
        variants={cardVariants}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <div className={header}>
          {icon && <div className={iconWrap}>{icon}</div>}
          <h1 className={titleClass}>{title}</h1>
          {subtitle && <p className={subtitleClass}>{subtitle}</p>}
        </div>

        {error}

        <div>{children}</div>

        {footer && <div className={footerClass}>{footer}</div>}
      </motion.div>
    </motion.section>
  );
}

export default AuthCardLayout;
