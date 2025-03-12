import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useQuery } from "@tanstack/react-query";
import { FetchTasks } from "../api/REST";
import { fredoka } from "..";

const Stats = [
  { name: "დასაწყები", color: "#F7BC30" },
  { name: "პროგრესში", color: "#FB5607" },
  { name: "მზად ტესტირებისთვის", color: "#FF006E" },
  { name: "დასრულებული", color: "#3A86FF" },
];

const Main = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["all"],
    queryFn: FetchTasks,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 20,
  });

  const [tasksByStatus, setTasksByStatus] = useState<{ [key: string]: any[] }>(
    {}
  );

  useEffect(() => {
    if (!data) return;

    const groupedTasks = data.reduce(
      (acc: { [key: string]: any[] }, item: any) => {
        const status = item.status.name;
        if (!acc[status]) acc[status] = [];
        acc[status].push(item);
        return acc;
      },
      {}
    );

    setTasksByStatus(groupedTasks);
  }, [data]);

  if (error) return <h1>Oops! Something went wrong.</h1>;
  if (isLoading) return <h1>Loading...</h1>;

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-start min-h-screen gap-10 px-5 md:px-10 text-[#212529]">
        <h1 className="text-[28px] md:text-[34px]">დავალებების გვერდი</h1>

        <div className="flex flex-wrap items-center justify-center md:justify-between w-full max-w-[688px] p-2 border border-[#DEE2E6] rounded-[10px]">
          <select
            id="options"
            name="options"
            className="w-full md:w-[199px] h-[44px]"
          >
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-5 md:gap-10 w-full">
          {Stats.map(({ name, color }) => (
            <div
              key={name}
              className="w-full sm:w-[48%] md:w-[381px] self-stretch"
            >
              <div
                className="py-2 h-[54px] text-center text-[20px] rounded-[10px] text-white"
                style={{ backgroundColor: color }}
              >
                <h1>{name}</h1>
              </div>

              <div className="flex flex-col gap-5 ">
                {tasksByStatus[name]?.map((item: any) => (
                  <div
                    key={item.id}
                    className="mt-5 h-auto w-full border rounded-[15px] p-5"
                    style={{ borderColor: color }}
                  >
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row gap-1 p-1 rounded-[5px] border border-green-500 text-green-500">
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

                    <div className="mt-5 text-left">
                      <h1 className="text-[17px] font-bold text-[#212529]">
                        {item.name}
                      </h1>
                      <h1 className="text-[#343A40] text-[16px]">
                        {item.description}
                      </h1>
                    </div>

                    <div className="flex flex-row items-center justify-between mt-5">
                      <div className="flex flex-row gap-3">
                        <img
                          src={item.employee.avatar}
                          alt="avatar"
                          className="h-[31px] w-[31px] rounded-full"
                        />
                        <h1>{item.employee.name}</h1>
                      </div>
                      <div className="flex flex-row gap-1 cursor-pointer">
                        <img
                          src="https://img.icons8.com/?size=100&id=11167&format=png&color=000000"
                          alt="comment"
                          className="h-[22] w-[22]"
                        />
                        <h1>{item.total_comments}</h1>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Main;
