import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FetchProperties, instance } from "../api/REST";
import { useDispatch, useSelector } from "react-redux";
import { ModeSwicher, RootState } from "../Redux/Slice";

const Registration = () => {
  const mode = useSelector((state: RootState) => state.store.mode);
  const dispatch = useDispatch();
  const [username, setUserName] = useState<string>("");
  const [surname, setSurName] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { data } = useQuery({
    queryKey: ["departments"],
    queryFn: () => FetchProperties("departments"),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 20,
  });

  useEffect(() => {
    console.log(data);
  }, [data]);

  const ApplyRegistration = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) {
      newErrors.username = "გთხოვთ შეიყვანოთ თქვენი სახელი.";
    }

    if (!surname.trim()) {
      newErrors.surname = "გთხოვთ შეიყვანოთ თქვენი გვარი.";
    }

    if (!avatar) {
      newErrors.avatar = "გთხოვთ მიუთითოთ თქვენი ავატარი.";
    }

    if (!selectedOption) {
      newErrors.selectedOption = "გთხოვთ მიუთითოთ დეპარტამენტი.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formData = new FormData();
      formData.append("name", username);
      formData.append("surname", surname);
      formData.append("avatar", avatar as Blob);
      formData.append("department_id", String(selectedOption));

      try {
        await instance.post("employees", formData, {
          headers: {
            Authorization: `Bearer 9e6a8204-857d-4f5c-b9ec-31baabaf3581`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Employee added successfully!");
        setUserName("");
        setSurName("");
        setAvatar(null);
        setSelectedOption(null);
        setErrors({});
        dispatch(ModeSwicher());
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }
  };

  return (
    <div
      className={`${
        mode ? "block" : "hidden"
      } flex items-center justify-center min-h-screen w-screen h-screen backdrop-blur-[3px] bg-[#5e5e5e85]`}
    >
      <div className="flex flex-col text-[14px] text-[#343A40] justify-evenly gap-10 w-[913px] h-[766px] px-[50px] py-[60px] bg-white rounded-[10px] mx-auto">
        <div
          onClick={() => dispatch(ModeSwicher())}
          className="h-[30px] w-[30px] rounded-full flex items-center justify-center cursor-pointer bg-[#DEE2E6] ml-auto"
        >
          <img src="/close.png" alt="X" className="h-5 w-5" />
        </div>

        <h1 className="text-[#212529] text-[32px] text-center">
          თანამშრომლის დამატება
        </h1>

        <div className="flex flex-row gap-[45px]">
          <div className="flex flex-col gap-1">
            
            <label>სახელი</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="p-[10px] w-[384px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
           
            <label>გვარი</label>
            <input
              type="text"
              value={surname}
              onChange={(e) => setSurName(e.target.value)}
              className="p-[10px] w-[384px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
            /> 
            {errors.surname && (
              <p className="text-red-500 text-sm">{errors.surname}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
         
          <label>ავატარი</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setAvatar(e.target.files[0])}
            className="border-dashed rounded-[5px] h-[120px] flex items-center justify-center w-[813px] border-[#CED4DA] border-1 p-[10px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
          /> 
          {errors.avatar && (
            <p className="text-red-500 text-sm">{errors.avatar}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 self-start">
         
          <label>დეპარტამენტი</label>
          <select
            name="department"
            onChange={(e) => setSelectedOption(Number(e.target.value))}
            value={selectedOption ?? ""}
            className="p-[10px] w-[384px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
          > 
          {errors.selectedOption && (
            <p className="text-red-500 text-sm">{errors.selectedOption}</p>
          )}
            <option value="">აირჩიეთ დეპარტამენტი</option>
            {data?.length > 0 ? (
              data.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))
            ) : (
              <option disabled>დეპარტამენტი ვერ მოიძებნა</option>
            )}
          </select>
        </div>

        <div className="flex flex-row gap-4 ml-auto">
          <button
            onClick={() => dispatch(ModeSwicher())}
            className="py-[10px] px-[20px] border-[1px] border-[#B588F4] rounded-md text-[16px] tex-[#212529] cursor-pointer transition-all ease-in-out hover:border-[#8338EC]"
          >
            გაუქმება
          </button>
          <button
            onClick={() => {dispatch(ModeSwicher()), ApplyRegistration}}
            className="py-[10px] px-[30px] border-[1px] bg-[#8338EC] rounded-md text-[16px] cursor-pointer transition-all ease-in-out text-white hover:bg-[#B588F4]"
          >
            დაამატე თანამშრომელი
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
