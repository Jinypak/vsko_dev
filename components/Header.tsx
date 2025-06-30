// import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import ProductList from './ProductList';
import HamburgerMenu from './mobile/HamburgerMenu';

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 border-b-2">
      {/* <Image src={'/'} width={250} alt="Vision Square" /> */}
      <div>Vision Square</div>
      <ProductList />
      <HamburgerMenu />
    </div>
  );
};

export default Header;
