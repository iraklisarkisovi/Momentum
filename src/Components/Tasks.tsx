import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useQuery } from "@tanstack/react-query";
import { FetchProperties, FetchTasks } from "../pages/api/REST";
import { format, isValid } from "date-fns";
import { ka } from "date-fns/locale";
import Registration from "./Registration";
import { useRouter } from "next/router";

const Stats = [
  { name: "დასაწყები", color: "#F7BC30" },
  { name: "პროგრესში", color: "#FB5607" },
  { name: "მზად ტესტირებისთვის", color: "#FF006E" },
  { name: "დასრულებული", color: "#3A86FF" },
];

const DropDowns = [
  { key: "departments", name: "დეპარტამენტი" },
  { key: "priorities", name: "პრიორიტეტი" },
  { key: "employees", name: "თანამშრომელი" },
] as const;


export type Task = {
  id: number;
  name: string;
  description: string;
  due_date: any;
  priority: { name: string; icon?: string; id: number };
  status: { name: string; id: number };
  employee: { surname: string; name: string; avatar: string; id: number };
  department: { name: string; id: number };
  total_comments: number;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (!isValid(date)) return "Invalid Date";
  return format(date, "d MMMM yyyy, HH:mm", { locale: ka });
};  

type FilterItem = { id: number; name: string };
type FilterKey = "departments" | "priorities" | "employees";

type SelectedFilters = {
  departments: FilterItem[];
  priorities: FilterItem[];
  employees: FilterItem[];
};

const FilteredVAl = {
    departments: [],
    priorities: [],
    employees: [],
}

const Main: React.FC = () => {


  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(FilteredVAl);

  const [activeFilter, setActiveFilter] = useState<
    "departments" | "priorities" | "employees" | null
  >(null);
  const [filterOptions, setFilterOptions] = useState<
    { id: number; name: string }[]
  >([]);
  const [tasksByStatus, setTasksByStatus] = useState<{ [key: string]: Task[] }>(
    {}
  );

  const { data, error, isLoading, refetch } = useQuery<Task[]>({
    queryKey: ["all"],
    queryFn: FetchTasks,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 20,
  });

  useEffect(() => {
    refetch()
  }, [])

  const { data: propertyData } = useQuery({
    queryKey: ["filters", activeFilter],
    queryFn: () => FetchProperties(activeFilter!),
    enabled: !!activeFilter,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 20,
  });

  useEffect(() => {
    if (propertyData && Array.isArray(propertyData)) {
      setFilterOptions(propertyData);
    }
  }, [propertyData]);

  const toggleFilter = (key: "departments" | "priorities" | "employees") => {
    setActiveFilter((prev) => (prev === key ? null : key));
  };

  const handleOptionSelect = (id: number, name: string) => {
    if (!activeFilter) return;
    setSelectedFilters((prev) => {
      const exists = prev[activeFilter].some((item) => item.id === id);
      if (exists) return prev;
      return {
        ...prev,
        [activeFilter]: [...prev[activeFilter], { id, name }],
      };
    });
  };

  useEffect(() => {
      if (!data) return;

      let filteredTasks = [...data];

      if (selectedFilters.departments.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          selectedFilters.departments.some(
            (dept) => task.department?.id === dept.id
          )
        );
      }

      if (selectedFilters.priorities.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          selectedFilters.priorities.some((prio) => task.priority?.id === prio.id)
        );
      }

      if (selectedFilters.employees.length > 0) {
        filteredTasks = filteredTasks.filter((task) =>
          selectedFilters.employees.some((emp) => task.employee?.id === emp.id)
        );
      }

      const groupedTasks = filteredTasks.reduce(
        (acc: { [key: string]: Task[] }, item) => {
          const status = item.status.name;
          if (!acc[status]) acc[status] = [];
          acc[status].push(item);
          return acc;
        },
        {}
      );

      setTasksByStatus(groupedTasks);
  }, [selectedFilters])

  useEffect(() => {
    if (data) {
      const groupedTasks = data.reduce(
        (acc: { [key: string]: Task[] }, item) => {
          const status = item.status.name;
          if (!acc[status]) acc[status] = [];
          acc[status].push(item);
          return acc;
        },
        {}
      );
      setTasksByStatus(groupedTasks);
    }
  }, [data]);

  const colorPicker = (id: number) => {
    if (id === 1) return "#08A508";
    if (id === 2) return "#FFBE0B";
    if (id === 3) return "#FA4D4D";
  };

  if (error) return <h1>Oops! Something went wrong.</h1>;
  if (isLoading) return <h1>Loading...</h1>;

  return (
    <>
      <div className="fixed z-10">
        <Registration />
      </div>

      <Header />
      <main className="flex flex-col items-start justify-start min-h-screen gap-5 px-5 md:px-10 text-[#212529]">
        <h1 className="text-[28px] md:text-[34px] md:ml-14">
          დავალებების გვერდი
        </h1>

        <div className="w-[688px] h-[44px] md:ml-14 flex justify-between rounded-[10px] border border-[#DEE2E6]">
          {DropDowns.map(({ key, name }) => (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              className={`px-4 flex items-center text-[16px] gap-2 transition ${
                activeFilter === key ? "text-[#8338EC]" : "text-black"
              }`}
            >
              <h1 className="font-sans">{name}</h1>
              <span>&#9662;</span>
            </button>
          ))}
        </div>

        <div className="flex flex-row gap-5 ml-16">
          {Object.entries(selectedFilters).map(([filterKey, values]) =>
            values.map((item) => (
              <div
                key={`${filterKey}-${item.id}`}
                onClick={() =>
                  setSelectedFilters((prevFilters) => ({
                    ...prevFilters,
                    [filterKey as FilterKey]: prevFilters[
                      filterKey as FilterKey
                    ].filter((f) => f.id !== item.id),
                  }))
                }
                className="rounded-full flex flex-row gap-3 cursor-pointer border-[1px] border-[#CED4DA] px-3 py-1 text-sm"
              >
                {item.name}
                <img
                  src="https://img.icons8.com/?size=100&id=46&format=png&color=000000"
                  alt="X"
                  className="w-5 h-5"
                />
              </div>
            ))
          )}
          <button className="cursor-pointer" onClick={() => setSelectedFilters(FilteredVAl)}>
            გასუფთავება
          </button>
        </div>

        {activeFilter && (
          <div className="flex flex-col items-left w-[688px] absolute border rounded-[10px] top-[230px] py-[40px] px-[25px] border-[#8338EC] bg-white md:ml-14 gap-2">
            {filterOptions.length > 0 ? (
              filterOptions.map((item) => (
                <div key={item.id} className="text-black flex gap-3">
                  <input
                    type="checkbox"
                    value={item.id}
                    onChange={() => handleOptionSelect(item.id, item.name)}
                    className="text-blue-600 rounded-2xl"
                  />
                  <h1>{item.name}</h1>
                </div>
              ))
            ) : (
              <h1>No options available...</h1>
            )}

          </div>
        )}

        <div className="flex flex-wrap md:ml-14 justify-center md:justify-start gap-5 md:gap-10 w-full">
          {Stats.map(({ name, color }) => (
            <div key={name} className="w-full sm:w-[48%] md:w-[381px]">
              <div
                className="py-3 h-[54px] text-center text-[20px] rounded-[10px] text-white"
                style={{ backgroundColor: color }}
              >
                <h1>{name}</h1>
              </div>
              <div className="flex flex-col gap-5 items-center mb-10">
                {tasksByStatus[name]?.length > 0 ? (
                  tasksByStatus[name].map((item) => {
                    const pickColor = colorPicker(item.priority.id);

                    return (
                      <div
                        key={item.id}
                        className="mt-5 h-auto w-full border rounded-[15px] p-5"
                        style={{ borderColor: color }}
                      >
                        <div
                          className="cursor-pointer"
                          onClick={() => router.push(`/${item.id}`)}
                        >
                          <div className="flex justify-between items-center">
                            <div
                              className={`flex items-center gap-1 p-1 rounded-[5px]`}
                              style={{
                                border: `1px solid ${pickColor}`,
                                color: `${pickColor}`,
                              }}
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
                            <h1 className="font-mono text-[#212529]">
                              {formatDate(item.due_date)}
                            </h1>
                          </div>

                          <div className="mt-5 text-left">
                            <h1 className="text-[17px] font-bold text-[#212529]">
                              {item.name}
                            </h1>
                            <h1 className="text-[#343A40] font-thin  text-[16px]">
                              {item.description}
                            </h1>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.employee.avatar}
                              alt="employee-avatar"
                              className="h-[31px] w-[31px] rounded-full"
                            />
                            <div className="flex flex-col text-left">
                              <div className="flex flex-row gap-1">
                                <h1>{item.employee.name}</h1>

                                <h1>{item.employee.surname}</h1>
                              </div>
                              <p className="text-sm text-[12px] font-bold text-neutral-600">
                                {item.department.name}
                              </p>
                            </div>
                          </div>
                          <div
                            onClick={() => router.push(`/${item.id}`)}
                            className="flex items-center gap-1 cursor-pointer"
                          >
                            <img
                              src="https://img.icons8.com/?size=100&id=11167&format=png&color=000000"
                              alt="comment"
                              className="h-[22px] w-[22px]"
                            />
                            <h1>{item.total_comments}</h1>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <h1 className="text-xl mt-10">მონაცემები ვერ მოიძებნა</h1>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Main;
