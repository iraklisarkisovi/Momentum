import React from 'react'
import { fredoka } from '..';
import { useDispatch } from 'react-redux';
import { ModeSwicher } from '../Redux/Slice';
import Link from 'next/link';

const Header = () => {
  const dispatch = useDispatch();

  return (
    <>
      <header className="flex flex-row sticky items-center justify-between top-0 w-full h-[100px] bg-[#fff] text-[#212529] px-20">
        <Link href='/'>
          <h1
            className="text-3xl font-bold text-[#8338EC] cursor-pointer"
            style={{ fontFamily: fredoka.style.fontFamily }}
          >
            Momentum
          </h1>
        </Link>
        <div className="flex flex-row gap-[10px]">
          <button
            onClick={() => dispatch(ModeSwicher())}
            className="p-2 border-[1px] border-[#B588F4] rounded-md text-[16px]
          tex-[#212529] cursor-pointer transition-all ease-in-out
          hover:border-[#8338EC]"
          >
            თანამშრომლის შექმნა
          </button>
          <Link href="/createtask">
            <h1 className="p-2 border-[1px] bg-[#8338EC] rounded-md text-[16px] cursor-pointer transition-all ease-in-out text-white hover:bg-[#B588F4]">
              
              + შექმენი ახალი დავალება
              
            </h1>
          </Link>
        </div>
      </header>
    </>
  );
}

export default Header
