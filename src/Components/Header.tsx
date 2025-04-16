import React, { useState } from 'react'
import { fredoka } from '../pages';
import { useDispatch } from 'react-redux';
import { ModeSwicher } from '../Redux/Slice';
import Link from 'next/link';

const Header = () => {
  const dispatch = useDispatch();
  const [menu, setMenu] = useState(false)

  return (
    <>
      <header className="flex flex-row w-full sticky items-center max-md:bg-[#eff5ff] justify-between top-0 h-[100px] bg-[#fff] text-[#212529] px-20">
        <Link href="/">
          <h1
            className="text-3xl font-bold text-[#8338EC] cursor-pointer"
            style={{ fontFamily: fredoka.style.fontFamily }}
          >
            Momentum
          </h1>
        </Link>
        <div
          className="hidden max-md:block"
          onClick={() => setMenu((prev) => !prev)}
        >
          <img
            src="https://img.icons8.com/?size=100&id=3096&format=png&color=9b5fef"
            alt="Menu"
            className="w-8"
          />
        </div>
        <div
          className={`flex flex-row max-md:flex-row max-md:absolute max-md:gap-10 max-md:bg-[#eff5ff] max-md:py-5 max-md:px-5 max-md:left-30 max-md:rounded-b-2xl transition-opacity max-sm:top-22 gap-[10px] ${
            menu
              ? "max-md:opacity-100 max-md:inline"
              : "max-md:opacity-0 max-md:hidden"
          }`}
        >
          <button
            onClick={() => dispatch(ModeSwicher())}
            className="p-2 border-[1px] border-[#B588F4] rounded-md text-[16px]
          tex-[#212529] cursor-pointer transition-all ease-in-out
          hover:border-[#8338EC]"
          >
            თანამშრომლის შექმნა
          </button>
          <Link href="/createtask">
            <h1 className="p-2 border-[1px] max-md:mt-2 bg-[#8338EC] rounded-md text-[16px] cursor-pointer transition-all ease-in-out text-white hover:bg-[#B588F4]">
              + შექმენი ახალი დავალება
            </h1>
          </Link>
        </div>
      </header>
    </>
  );
}

export default Header
