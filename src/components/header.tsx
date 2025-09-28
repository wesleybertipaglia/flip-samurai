'use client';

import { Button } from '@progress/kendo-react-buttons';
import { menuIcon } from '@progress/kendo-svg-icons';

interface Props {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: Props) => {
  const currentTitle = document.title;

  return (
    <header className="bg-white border-bottom sticky-top px-5 py-3">
      <div className="d-flex align-items-center gap-4">
        <Button svgIcon={menuIcon} type="button" size='small' className='bg-outline border-0' onClick={toggleSidebar} />
        <div className="text-sm font-medium">{currentTitle}</div>
      </div>
    </header>
  );
};

export default Header;
