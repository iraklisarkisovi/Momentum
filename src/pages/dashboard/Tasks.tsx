import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useQuery } from "@tanstack/react-query";
import { FetchProperties, FetchTasks } from "../api/REST";
import { fredoka } from "..";
import { format } from "date-fns";
import { ka } from "date-fns/locale";

const Stats = [
  { name: "დასაწყები", color: "#F7BC30" },
  { name: "პროგრესში", color: "#FB5607" },
  { name: "მზად ტესტირებისთვის", color: "#FF006E" },
  { name: "დასრულებული", color: "#3A86FF" },
];

const DropDowns = [
  { key: "department", name: "დეპარტამენტი", KeyName: "departments" },
  { key: "priority", name: "პრიორიტეტი", KeyName: "priorities" },
  { key: "employee", name: "თანამშრომელი", KeyName: "employees" },
] as const;

type Task = {
  option: any;
  id: number;
  name: string;
  description: string;
  due_date: string;
  priority: { name: string; icon?: string };
  status: { name: string };
  employee: { name: string; avatar: string };
  department: { name: string };
  total_comments: number;
};

const Main: React.FC = () => {
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [department, setDepartment] = useState(false);
  const [priority, setPriority] = useState(false);
  const [employee, setEmployee] = useState(false);
  const [all, setAll] = useState(false);
  const [option, setOption] = useState<string>("");

  useEffect(() => {
    console.log(option, selectedDepartments);
  }, [option, selectedDepartments]);

  const [activeFilter, setActiveFilter] = useState<
    "department" | "priority" | "employee" | null
  >(null);

  const toggleFilter = (
    filter: "department" | "priority" | "employee",
    name: string
  ) => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
    setDepartment(filter === "department");
    setPriority(filter === "priority");
    setEmployee(filter === "employee");
    {
      (department || priority || employee) && setAll((prop) => !prop);
    }
    setOption(name);
  };

  const [tasksByStatus, setTasksByStatus] = useState<{ [key: string]: Task[] }>(
    {}
  );

  const { data, error, isLoading } = useQuery<Task[]>({
    queryKey: ["all"],
    queryFn: FetchTasks,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 20,
  });

  const { data: data2 } = useQuery({
    queryKey: ["departments", option],
    queryFn: () => FetchProperties(option),
    enabled: !!option,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 20,
  });

  const OptionHandling = (id: number) => {
    setSelectedDepartments((prev) =>
      prev.includes(id) ? prev.filter((prevId) => prevId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (!data) return;

    const filterKey =
      activeFilter === "department"
        ? "department"
        : activeFilter === "priority"
        ? "priority"
        : activeFilter === "employee"
        ? "employee"
        : null;

    const filteredTasks =
      filterKey && selectedDepartments.length
        ? data.filter(
            (task) =>
              task[filterKey as keyof Task] &&
              "id" in task[filterKey as keyof Task] &&
              selectedDepartments.includes(
                (task[filterKey as keyof Task] as { id: number }).id
              )
          )
        : data;

    const groupedTasks = filteredTasks.reduce(
      (acc: { [key: string]: Task[] }, item: Task) => {
        const status = item.status.name;
        if (!acc[status]) acc[status] = [];
        acc[status].push(item);
        return acc;
      },
      {}
    );

    setTasksByStatus(groupedTasks);
  }, [data, selectedDepartments, activeFilter]);

  useEffect(() => {
    if (data2 && Array.isArray(data2)) {
      setDepartments(data2);
    }
  }, [data2]);

  useEffect(() => {
    if (!data) return;

    const groupedTasks = data?.reduce(
      (acc: { [key: string]: Task[] }, item: Task) => {
        const status = item.status.name;
        if (!acc[status]) acc[status] = [];
        acc[status].push(item);
        return acc;
      },
      {}
    );

    setTasksByStatus(groupedTasks);
  }, [data, activeFilter]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: ka });
  };

  if (error) return <h1>Oops! Something went wrong.</h1>;
  if (isLoading) return <h1>Loading...</h1>;

  return (
    <>
      <Header />
      <main className="flex flex-col items-start justify-start min-h-screen gap-5 px-5 md:px-10 text-[#212529]">
        <h1 className="text-[28px] md:text-[34px] md:ml-14">
          დავალებების გვერდი
        </h1>

        <div className="w-[688px] h-[44px] md:ml-14 flex justify-between rounded-[10px] border-[0.5px] border-[#DEE2E6]">
          {DropDowns.map(({ key, name, KeyName }) => (
            <button
              key={key}
              onClick={() => toggleFilter(key, KeyName)}
              className={`px-4 flex items-center text-[16px] gap-2 transition ${
                key === activeFilter ? "text-[#8338EC]" : "text-black"
              }`}
            >
              <h1 className="font-sans">{name}</h1>
              <span
                className={`width-[10px] ${
                  key === activeFilter ? "text-[#8338EC]" : "text-black"
                }`}
              >
                &#9662;
              </span>
            </button>
          ))}
        </div>

        <div
          className={`${
            all ? "block" : "hidden"
          } flex flex-col items-left w-[688px] absolute border-[0.5px] rounded-[10px] top-[230px] py-[40px] px-[25px] border-[#8338EC] bg-white justify-evenly gap-2 md:ml-14`}
        >
          {departments && departments.length > 0 ? (
            departments.map((item: any) => (
              <div key={item.id} className="text-black flex flex-row gap-3">
                <input
                  type="checkbox"
                  value={item.id}
                  onChange={() => OptionHandling(item.id)}
                  className="text-blue-600 border-blue-600 rounded-2xl"
                />
                <h1>{item.name}</h1>
              </div>
            ))
          ) : (
            <h1>{option + " are not avaliable..."}</h1>
          )}
          <button className="cursor-pointer w-[155px] ml-[450px] text-white rounded-[20px] px-[20px] py-[8px] transition-colors ease-out bg-[#8338EC] hover:bg-[#B588F4]">
            არჩევა
          </button>
        </div>

        <div className="flex flex-wrap md:ml-14 justify-center md:justify-start gap-5 md:gap-10 w-full">
          {Stats.map(({ name, color }) => (
            <div
              key={name}
              className="w-full sm:w-[48%] md:w-[381px] self-stretch"
            >
              <div
                className="py-3 h-[54px] text-center text-[20px] rounded-[10px] text-white"
                style={{ backgroundColor: color }}
              >
                <h1>{name}</h1>
              </div>

              <div className="flex flex-col gap-5 items-center mb-10">
                {tasksByStatus[name]?.map((item) => (
                  <div
                    key={item.id}
                    className="mt-5 h-auto w-full border rounded-[15px] p-5"
                    style={{ borderColor: color }}
                  >
                    <div className="flex justify-between items-center">
                      <div
                        className="flex items-center gap-1 p-1 rounded-[5px] border"
                        style={{ borderColor: "#FFBE0B", color: "#FFBE0B" }}
                      >
                        <img
                          src={
                            item.priority.icon ||
                            "https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                          }
                          alt="priority-icon"
                        />
                        <h1>{item.priority.name}</h1>
                      </div>
                      <h1
                        className="font-mono text-[#212529]"
                        style={{ fontFamily: fredoka.style.fontFamily }}
                      >
                        {formatDate(item.due_date)}
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

                    <div className="flex justify-between items-center mt-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.employee.avatar}
                          alt="employee-avatar"
                          className="h-[31px] w-[31px] rounded-full"
                        />
                        <div className="flex flex-col text-left">
                          <h1>{item.employee.name}</h1>
                          <p className="text-sm text-[13px] text-neutral-600">
                            {item.department.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 cursor-pointer">
                        <img
                          src="https://img.icons8.com/?size=100&id=11167&format=png&color=000000"
                          alt="comment"
                          className="h-[22px] w-[22px]"
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
