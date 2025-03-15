import React from 'react'
import { fredoka } from '..';
import { useDispatch } from 'react-redux';
import { ModeSwicher } from '../Redux/Slice';

const Header = () => {
  const dispatch = useDispatch();

  return (
    <>
      <header className="flex flex-row sticky items-center justify-between top-0 w-full h-[100px] bg-[#fff] text-[#212529] px-20">
        <h1
          className="text-3xl font-bold text-[#8338EC] cursor-pointer"
          style={{ fontFamily: fredoka.style.fontFamily }}
        >
          Momentum
        </h1>
        <div className="flex flex-row gap-[10px]">
         
          <button onClick={() => dispatch(ModeSwicher())} className="p-2 border-1 border-[#8338EC] rounded-md text-[16px] cursor-pointer transition-all  ease-in-out hover:text-[#fff] hover:bg-[#8338EC]">
            თანამშრომლის შექმნა
          </button>
          <button className="p-2 border-1 border-[#8338EC] rounded-md text-[16px] cursor-pointer transition-all  ease-in-out hover:text-[#fff] hover:bg-[#8338EC]">
            + შექმენი ახალი დავალება
          </button>
        </div>
      </header>
    </>
  );
}

export default Header
