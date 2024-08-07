import { Button, cn } from 'ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

export type SidebarItemProps = {
  path: string;
  name: string;
  icon: ReactNode;
};

type Props = SidebarItemProps & {
  onClick?: () => void;
};

const ActiveIndicator = ({ classname }: { classname?: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className={cn(
      'size-1.5 animate-pulse rounded-full bg-info shadow-[0_0_12px] shadow-info',
      classname,
    )}
  />
);

const SidebarItem: FC<Props> = ({ path, name, icon, onClick }) => {
  const isActive = usePathname() === path;

  return (
    <Link href={path} className="w-full">
      <Button onClick={onClick} variant="ghost" className="w-full">
        <div className="flex w-full items-center text-foreground">
          <div className="mr-3">{icon}</div>
          <span>{name}</span>
          {isActive && <ActiveIndicator classname="ml-auto" />}
        </div>
      </Button>
    </Link>
  );
};

export default SidebarItem;
