import React from 'react'
import Header from './Header'
import { useQuery } from '@tanstack/react-query';
import { FetchTasks } from '../api/REST';
import { fredoka } from '..';

const Stats = [
  { name: "დასაწყები", color: "#F7BC30" },
  { name: "პროგრესში", color: "#FB5607" },
  { name: "მზად ტესტირებისთვის", color: "#FF006E" },
  { name: "დასრულებული", color: "#3A86FF" },
];

const Main = () => {
  const {data, error, isLoading} = useQuery({
    queryKey: ["all"],
    queryFn: () => FetchTasks(),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 20,
  });

  console.log(data);
  
  return (
    <>
      <Header />
      <main className="flex flex-col justify-start min-h-screen gap-10 mx-10 text-[#212529]">
        <div className="flex flex-col items-left justify-baseline gap-11">
          <h1 className="text-[34px]">დავალებების გვერდი</h1>
          <div className="flex flex-row items-center justify-around h-[44px] w-[688px] p-2 border-[1px] border-[#DEE2E6] active:outline-none focus:ring-2 focus:ring-blue-500 rounded-[10px]">
            <select id="options" name="options" className="w-[199px] h-[44px]">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </div>
          <div className="flex flex-row items-end justify-between">
            {Stats.map(({ name, color }) => (
              <div
                className="py-[10px] h-[54px] w-[381px] text-center text-[20px] rounded-[10px] text-white"
                style={{ backgroundColor: color }}
              >
                <h1>{name}</h1>
              </div>
            ))}
          </div>

          {data?.map((item: any) => (
            <>
              <div
                className="mt-10 h-auto w-[381px] border-[1px] rounded-[15px]"
                style={{ borderColor: "red" }}
              >
                <div className="m-5">
                  <div className="flex flex-row items-center justify-between">
                    <div
                      className="flex flex-row gap-1 p-[4px] rounded-[5px] border-[0.5px]"
                      style={{ borderColor: "#08A508", color: "#08A508" }}
                    >
                      <img
                        src={
                          item.priority.icon ||
                          "https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                        }
                        alt="icon"
                      />
                      <h1>{item.priority.name}</h1>
                    </div>
                    <h1
                      className="font-mono text-[#212529]"
                      style={{ fontFamily: fredoka.style.fontFamily }}
                    >
                      {item.due_date}
                    </h1>
                  </div>

                  <div className="flex flex-col items-left justify-center m-10 gap-[12px] text-left">
                    <h1 className="text-[17px] font-bold text-[#212529] leading-[100%] tracking-[0%]">
                      {item.name}
                    </h1>
                    <h1 className="text-[#343A40] text-[16px] leading-[100%] tracking-[0%]">
                      {item.description}
                    </h1>
                  </div>

                  <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-3">
                      <img
                        src={item.employee.avatar}
                        alt="avatar"
                        className="h-[31px] w-[31px] rounded-full"
                      />
                      <h1>{item.employee.name}</h1>
                    </div>
                    <div className='flex flex-row gap-1 cursor-pointer'>
                      <img
                        src="https://img.icons8.com/?size=100&id=11167&format=png&color=000000"
                        alt="comment"
                        className='h-[22] w-[22]'
                      />
                      <h1>{item.total_comments}</h1>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>
      </main>
    </>
  );
}

export default Main


 
