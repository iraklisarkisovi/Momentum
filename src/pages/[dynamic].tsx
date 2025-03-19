import React, { useEffect, useState } from 'react'
import Header from './dashboard/Header'
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { FetchComments, FetchTasks, instance } from './api/REST';
import { Task, formatDate } from './dashboard/Tasks';
import { Deadline, Employee, Status } from './dashboard/Svgs';
import { fredoka } from '.';
import Registration from './dashboard/Registration';

const TaskInfo = () => {
  const router = useRouter()
  const { dynamic } = router.query;
 
  const [task, setTask] = useState<Task | undefined>();
  const [Stat, setStat] = useState<{ name: string; id: number }[]>()
  const [StatChange, setStatChange] = useState<number>()
  const [HandleText, setHandleText] = useState<string>('')
  const [color, setColor] = useState<string>();
  const [Isactive, setIsactive] = useState<{status: boolean, id: number | null}>({status: false, id: null});

  const { data, error, isLoading } = useQuery<Task[] | undefined>({
    queryKey: ["all"],
    queryFn: FetchTasks,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 20,
  });

  const PostComment = async (id: number | null) => {
    const userRaw = localStorage.getItem("ValEmployee");
    const user = userRaw ? JSON.parse(userRaw) : null;
    console.log(user.name);

    const postDat = {
      text: HandleText,
      author_avatar: user.avatar,
      author_nickname: user.name,
      parent_id: id || null,
    };
    
    try{
      await instance.post(`tasks/${task?.id}/comments`, postDat)
      setHandleText('')
      refetch()
    }catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    refetch()
  }, [])

  const {
    data: comments,
    error: comerr,
    isLoading: comload,
    refetch,
  } = useQuery({
    queryKey: ["comments", task?.id],
    queryFn: () => FetchComments(task?.id),
    enabled: !!task?.id && !!PostComment,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 20,
  });

  useEffect(() => {
    const PutReq = async () => {
      try{
        await instance.put(`tasks/${task?.id}`, { status_id: StatChange });
        console.log('successly changed status')
      }catch(err) {
        console.log(err)
      }
    }

    PutReq()
  }, [StatChange])

  useEffect(() => {
    const FetchProperties = async () => {
      const res = await instance.get("statuses");
      return setStat(res.data.filter(
      (prev: { name: string; id: number }) => prev.id !== task?.status.id
    ));
    };

    FetchProperties();
  }, [data]);

  error && comerr && console.log(error)
  isLoading && comload && <h1>Loading...</h1>

  useEffect(() => {
    const filteredData = data?.find((prev) => prev.id === Number(dynamic))
    setTask(filteredData)

    const colorPicker = (id: number | undefined) => {
      if (id === 1) return "#08A508";
      if (id === 2) return "#FFBE0B";
      if (id === 3) return "#FA4D4D";
    };

    setColor(colorPicker(filteredData?.priority.id));
  }, [data])

  return (
    <>
      <div className="fixed z-10">
        <Registration />
      </div>
      <Header />
      <div className="w-full h-full bg-[#fff] flex mt-12 items-start justify-around min-h-screen">
        <div className="flex flex-col text-[#212529] items-start justify-between gap-52">
          <div className="gap-[26px] flex flex-col">
            <div
              className={`flex items-center justify-center gap-1 h-[32px] w-[106px] p-1 rounded-[5px]`}
              style={{
                border: `1px solid ${color}`,
                color: `${color}`,
              }}
            >
              <img
                src={
                  task?.priority.icon ||
                  "https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                }
                alt="priority-icon"
              />
              <h1>{task?.priority.name}</h1>
            </div>
            <h1 className="text-[34px] font-[600]">{task?.name}</h1>
            <h1 className="text-[18px]">{task?.description}</h1>
          </div>

          <div className="flex flex-col items-start justify-center gap-[18px] w-[493px] h-[277px]">
            <h1 className="text-[24px] font-[500]">დავალების დეტალები</h1>
            <div className="flex flex-row items-center justify-around gap-[70px]">
              <div className="flex flex-row gap-1">
                <Status />
                <h1>სტატუსი</h1>
              </div>
              <select
                name="department"
                onChange={(e) => setStatChange(Number(e.target.value))}
                value={StatChange ?? ""}
                className="p-[10px] w-[259px] h-[45px] border-[1px] border-[#CED4DA] rounded-[6px] focus:outline-none focus:border-[1.6px] focus:border-[#ADB5BD]"
              >
                <option value="" hidden>
                  {task?.status.name}
                </option>
                {Stat?.map(({ id, name }) => (
                  <>
                    <option key={id} value={id}>
                      {name}
                    </option>
                  </>
                ))}
              </select>
            </div>
            <div className="flex flex-row gap-[70px] items-center justify-around">
              <div className="flex flex-row gap-1">
                <Employee />
                <h1>თანამშრომელი</h1>
              </div>
              <div className="flex justify-between items-center mt-5">
                <div className="flex items-center gap-3">
                  <img
                    src={task?.employee.avatar}
                    alt="employee-avatar"
                    className="h-[31px] w-[31px] rounded-full"
                  />
                  <div className="flex flex-col text-left">
                    <div className="flex flex-row gap-1">
                      <h1>{task?.employee.name}</h1>

                      <h1>{task?.employee.surname}</h1>
                    </div>
                    <p className="text-sm text-[13px] text-neutral-600">
                      {task?.department.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-[70px]">
              <div className="flex flex-row gap-1">
                <Deadline />
                <h1>დავალების ვადა</h1>
              </div>
              <div>
                {" "}
                <h1
                  className="font-mono text-[#212529]"
                  style={{ fontFamily: fredoka.style.fontFamily }}
                >
                  {formatDate(task?.due_date)}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[741px] flex flex-col px-16 gap-5 py-10 text-[#212529] h-auto bg-[#DDD2FF] rounded-[10px] border border-[#F8F3FEA6]">
          <textarea
            placeholder="დაწერე კომენტარი"
            value={HandleText}
            onChange={(e) => setHandleText(e.target.value)}
            className="bg-white max-h-[200px] min-h-[60px] w-full h-[135px] p-4 border border-[#CED4DA] rounded-md focus:outline-none focus:border-2 focus:border-[#afafaf] resize-none"
          />

          <button
            onClick={() => PostComment(null)}
            className="self-end cursor-pointer w-[155px] text-white rounded-full px-5 py-2 transition-colors ease-out bg-[#8338EC] hover:bg-[#B588F4]"
          >
            დააკომენტარე
          </button>

          <div className="flex flex-row items-center gap-4">
            <h1 className="text-3xl font-bold">კომენტარები</h1>
            <h1 className="bg-[#8338EC] flex w-9 h-7 text-white rounded-3xl justify-center items-center px-2">
              {comments?.length > 0 ? comments?.length : 0}
            </h1>
          </div>

          <div className="flex flex-col gap-10">
            {comments?.map((item: any) => (
              <div key={item.id} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <img
                    src={item.author_avatar}
                    alt="employee-avatar"
                    className="h-[31px] w-[31px] rounded-full object-cover"
                  />
                  <div className="text-left">
                    <h1 className="font-semibold">{item.author_nickname}</h1>
                  </div>
                </div>

                <p className="text-left ml-10 text-sm">{item.text}</p>
                <div className="flex flex-col m-3 ml-10 items-start justify-center gap-5">
                  {item.sub_comments?.map((subItem: any) => (
                    <div
                      key={subItem.id}
                      className="flex flex-row gap-3 text-black ml-5"
                    >
                      <img
                        src={item.author_avatar}
                        alt="employee-avatar"
                        className="h-[31px] w-[31px] rounded-full object-cover"
                      />
                      <div className="flex flex-col items-start gap-2">
                        <h1 className="font-semibold">
                          {subItem.author_nickname}
                        </h1>
                        <h1 className="text-left">{subItem.text}</h1>
                      </div>
                    </div>
                  ))}
                </div>
                {Isactive.id === item.id && Isactive.status && (
                  <>
                    <div id={item.id}>
                      <input
                        type="text"
                        value={HandleText}
                        onChange={(e) => setHandleText(e.target.value)}
                        className="p-[10px] bg-white w-[384px] border-[1px] border-[#CED4DA] rounded-l-2xl focus:outline-none focus:border-[1.6px] focus:border-[#afafaf]"
                      />
                      <button
                        onClick={() => PostComment(item.id)}
                        className="self-end cursor-pointer w-[155px] text-white rounded-r-full px-5 py-3 transition-colors ease-out bg-[#8338EC] hover:bg-[#B588F4]"
                      >
                        დააკომენტარე
                      </button>
                    </div>
                  </>
                )}
                <div className="ml-10 cursor-pointer text-[#8338EC] flex flex-col gap-2">
                  <div
                    onClick={() =>
                      setIsactive((prev) => ({
                        status: !prev.status,
                        id: item.id,
                      }))
                    }
                    className="flex items-center gap-2"
                  >
                    <img
                      src="https://img.icons8.com/?size=100&id=100399&format=png&color=8338EC"
                      alt="arrow"
                      className="w-5 h-auto"
                    />
                    <h1>უპასუხე</h1>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskInfo
