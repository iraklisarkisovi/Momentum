import React, { useState, ChangeEvent, useEffect } from "react";
import Header from "./dashboard/Header";
import Registration from "./dashboard/Registration";
import { instance } from "./api/REST";

interface FormData {
  name: string;
  description: string;
  priority_id: string;
  status_id: string;
  department_id: string;
  employee_id: string;
  due_date: string;
}

interface OptionType {
  id: number;
  name: string;
}

type TypeOfPriorities = {
  name: string,
  id: string,
  icon: string
}

const TaskCreation: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    priority_id: "",
    status_id: "",
    department_id: "",
    employee_id: "",
    due_date: "",
  });

  const [employees, setEmployees] = useState<OptionType[]>([]);
  const [departments, setDepartments] = useState<OptionType[]>([]);
  const [statuses, setStatuses] = useState<OptionType[]>([]);
  const [priorities, setPriorities] = useState<TypeOfPriorities[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "გთხოვთ, შეიყვანეთ სათაური.";
    } else if (formData.name.trim().length < 2 || formData.name.trim().length > 255) {
      newErrors.name = "სათაური უნდა იყოს 2-255 სიმბოლო.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "გთხოვთ, შეიყვანეთ აღწერა.";
    } else if (
      formData.description.trim().length < 2 ||
      formData.description.trim().length > 255
    ) {
      newErrors.description = "აღწერა უნდა იყოს 2-255 სიმბოლო.";
    }

    if (!formData.priority_id) newErrors.priority_id = "აირჩიეთ პრიორიტეტი.";
    if (!formData.status_id) newErrors.status_id = "აირჩიეთ სტატუსი.";
    if (!formData.department_id)
      newErrors.department_id = "აირჩიეთ დეპარტამენტი.";
    if (!formData.employee_id) newErrors.employee_id = "აირჩიეთ თანამშრომელი.";
    if (!formData.due_date) newErrors.due_date = "აირჩიეთ დედლაინი.";

    setErrors(newErrors);
    console.log(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log("Valid Form Data:", formData);

      const postTaskData = async () => {
        try{
          instance.post("tasks", formData);
        }catch(error){
          console.log("error message" + error)
        }
      }

      postTaskData()
    }
  };

  useEffect(() => {
    Promise.all([
      instance("/employees"),
      instance("/departments"),
      instance("/priorities"),
      instance("/statuses"),
    ])
      .then(([employeeData, departmentData, priorityData, statusData]) => {
        setEmployees(employeeData.data);
        setDepartments(departmentData.data);
        setPriorities(priorityData.data);
        setStatuses(statusData.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);


  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="fixed z-10">
        <Registration />
      </div>
      <Header />

      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-[1684px]">
          <h1 className="text-4xl font-bold text-[#343A40] mr-auto mb-10">
            შექმენი ახალი დავალება
          </h1>
        </div>
        <div className="flex bg-[#FBF9FFA6] w-[1684px] rounded-[4px] text-[#343A40] h-[804px] flex-row items-center justify-around">
          <div className="flex flex-col items-start justify-between gap-27">
            <div className="flex flex-col items-start gap-1">
              <label>
                სათაური
                {errors.name && <b className="text-[#a50808]">*</b>}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-[10px] w-[550px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
              />
              {errors.name && (
                <p className="text-[#08A508] text-sm">{errors.title}</p>
              )}
            </div>

            <div className="flex flex-col items-start gap-1">
              <label>
                აღწერა
                {errors.description && <b className="text-[#a50808]">*</b>}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={260}
                className="p-[10px] max-h-[200px] min-h-[150px] w-[550px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
              />
              {errors.description && (
                <p className="text-[#08A508] text-sm">{errors.title}</p>
              )}
            </div>

            <div className="flex flex-row items-start gap-8">
              <div className="flex flex-col items-start gap-1">
                <label>
                  პრიორიტეტი
                  {errors.priority_id && <b className="text-[#a50808]">*</b>}
                </label>
                <select
                  name="priority_id"
                  value={formData.priority_id}
                  onChange={handleChange}
                  className="p-[10px] w-[259px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
                >
                  <option value="" disabled hidden>
                    აირჩიეთ პრიორიტეტი
                  </option>
                  {priorities.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
                {errors.priority_id && (
                  <p className="text-[#08A508] text-sm">{errors.title}</p>
                )}
              </div>

              <div className="flex flex-col items-start gap-1">
                <label>
                  სტატუსი
                  {errors.status_id && <b className="text-[#a50808]">*</b>}
                </label>
                <select
                  name="status_id"
                  value={formData.status_id}
                  onChange={handleChange}
                  className="p-[10px] w-[259px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
                >
                  <option value="" disabled hidden>
                    აირჩიეთ სტატუსი
                  </option>
                  {statuses.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
                {errors.status_id && (
                  <p className="text-[#08A508] text-sm">{errors.title}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-25">
            <div className="flex flex-col items-start gap-1">
              <label>
                დეპარტამენტი
                {errors.department_id && <b className="text-[#a50808]">*</b>}
              </label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="p-[10px] w-[384px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
              >
                <option value="" disabled hidden>
                  აირჩიეთ დეპარტამენტი
                </option>

                {departments.map((item) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
              {errors.department_id && (
                <p className="text-[#08A508] text-sm">{errors.title}</p>
              )}
            </div>

            <div className="flex flex-col items-start gap-1">
              <label>
                პასუხისმგებელი თანამშრომელი
                {errors.employee_id && <b className="text-[#a50808]">*</b>}
              </label>
              <select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="p-[10px] w-[384px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
              >
                <option value="" disabled hidden>
                  აირჩიეთ თანამშრომელი
                </option>

                {employees.map((item) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
              {errors.employee_id && (
                <p className="text-[#08A508] text-sm">{errors.title}</p>
              )}
            </div>

            <div className="flex flex-col items-start gap-1">
              <label>დედლაინი</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="p-[10px] w-[316px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="ml-auto py-[10px] px-[20px] border-[1px] bg-[#8338EC] rounded-md text-[16px] cursor-pointer transition-all ease-in-out text-white hover:bg-[#B588F4]"
            >
              დავალების შექმნა
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCreation;
