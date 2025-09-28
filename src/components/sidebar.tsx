'use client';

import { Link, useLocation } from 'react-router-dom';

import { SvgIcon } from '@progress/kendo-react-common';
import { folderIcon, groupCollectionIcon, homeIcon, starIcon } from '@progress/kendo-svg-icons';

interface Props {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: Props) => {
  const location = useLocation();

  const links = [
    { icon: homeIcon, to: '/', label: 'Dashboard' },
    { icon: starIcon, to: '/favorites', label: 'Favorites' },
    { icon: groupCollectionIcon, to: '/collections', label: 'Collections' },
    { icon: folderIcon, to: '/folders', label: 'Folders' },
  ];

  return (
    <aside
      className="bg-white border-end d-flex flex-column p-3 transition-all align-items-center"
      style={{
        width: isOpen ? '100%' : '90px',
        maxWidth: '300px',
        transition: 'width 0.2s ease',
        overflowX: 'hidden',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div className="d-flex align-items-center mb-4 gap-2 w-100">
        <img
          src="/logo.png"
          alt="Logo"
          className="bg-light rounded-circle p-2 border"
          style={{ width: isOpen ? 64 : 48, transition: 'width 0.2s' }}
        />

        {isOpen && <h1 className="fs-4 m-0">Flip Samurai</h1>}
      </div>

      <nav className="nav nav-pills flex-column w-100">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link text-start text-truncate text-dark d-flex align-items-center gap-2 p-2 border mb-2 ${isOpen ? '' : 'mx-auto'} ${location.pathname === link.to ? 'bg-light' : ''
              }`}
            title={link.label}
          >
            <SvgIcon icon={link.icon} size="large" themeColor="inherit" />
            {isOpen && <span className="ms-2 fw-medium">{link.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
