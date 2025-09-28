import React, { useState, useRef, useEffect } from 'react';

export type SubMenuItem = {
    label: string,
    onClick: () => void,
    isDisabled?: boolean,
    isHighlighted?: boolean
};

export type MenuItem = {
    label: string,
    onClick?: () => void,
    icon?: React.ReactNode,
    subMenuItems?: SubMenuItem[],
    isDisabled?: boolean,
    isHighlighted?: boolean
};

type Props = {
    children: React.ReactNode;
    menuItems: MenuItem[];
};

const MenuList: React.FC<{ items: (MenuItem | SubMenuItem)[], closeAll: () => void }> = ({ items, closeAll }) => {
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState<number | null>(null);

    return (
        <div
            className="list-group list-group-flush"
        >
            {items.map((item, index) => {
                const isSubMenu = 'subMenuItems' in item && item.subMenuItems && item.subMenuItems.length > 0;

                const handleItemClick = () => {
                    if (isSubMenu) {
                        setOpenSubMenuIndex(index === openSubMenuIndex ? null : index);
                    } else if (item.onClick) {
                        item.onClick();
                        closeAll();
                    }
                };

                const buttonClass = `dropdown-item d-flex align-items-center justify-content-between gap-2 text-nowrap
                    ${item.isDisabled ? 'disabled text-muted' : ''} 
                    ${item.isHighlighted ? 'bg-info bg-opacity-10 fw-medium' : ''}
                    ${isSubMenu && openSubMenuIndex === index ? 'active' : ''}
                `;

                return (
                    <div
                        key={index}
                        className="position-relative"
                        onMouseEnter={() => isSubMenu && setOpenSubMenuIndex(index)}
                        onMouseLeave={() => isSubMenu && setOpenSubMenuIndex(null)}
                    >
                        <button
                            className={buttonClass}
                            type="button"
                            onClick={handleItemClick}
                            disabled={item.isDisabled}
                            style={{ cursor: item.isDisabled ? 'default' : 'pointer', minWidth: '100%' }}
                        >
                            <span className="d-flex align-items-center gap-2">
                                {'icon' in item && item.icon}
                                {item.label}
                            </span>
                        </button>

                        {isSubMenu && openSubMenuIndex === index && (
                            <div className="dropdown-menu show"
                                style={{
                                    position: 'absolute',
                                    left: '100%',
                                    top: '0',
                                    marginTop: '-4px',
                                    minWidth: 'max-content',
                                    zIndex: 1060
                                }}
                            >
                                <MenuList items={item.subMenuItems!} closeAll={closeAll} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export const Dropdown: React.FC<Props> = ({ children, menuItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const closeAll = () => setIsOpen(false);
    const toggleDropdown = () => setIsOpen(prev => !prev);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeAll();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="dropdown" style={{ position: 'relative', zIndex: 1050 }}>
            <div onClick={toggleDropdown} role="button" aria-expanded={isOpen}>
                {children}
            </div>

            {isOpen && (
                <div
                    className={`dropdown-menu ${isOpen ? 'show' : ''} dropdown-menu-end`}
                    style={{
                        position: 'absolute',
                        minWidth: 'max-content',
                    }}
                >
                    <MenuList items={menuItems} closeAll={closeAll} />
                </div>
            )}
        </div>
    );
};