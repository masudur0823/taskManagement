import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomTable from "../components/CustomTable";

function Home() {
  const [isMultiInput, setIsmultiInput] = useState(false);
  // form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "inactive",
  });
  const [formDatas, setFormDatas] = useState([
    {
      title: "",
      description: "",
      status: "inactive",
    },
  ]);

  const [data, setData] = useState([]);

  const getData = () => {
    axios("http://localhost:5000/task/")
      .then((response) => {
        setData(response?.data?.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const handleMultiFormChange = (Index, field, value) => {
    const updatedForm = [...formDatas];
    updatedForm[Index][field] = value;
    setFormDatas(updatedForm);
  };

  // add a task
  const handleAdd = () => {
    const url = "http://localhost:5000/task/";

    if (formData.title === "") {
      toast.error("Title is required");
    } else {
      axios
        .post(url, formData)
        .then((response) => {
          toast.success("Title is added successfully");
          getData();
          setFormData({
            title: "",
            description: "",
            status: "inactive",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // add multiple task
  const handleMultiAdd = () => {
    console.log(formDatas);
    const url = "http://localhost:5000/task/all";
    axios
      .post(url, formDatas)
      .then((response) => {
        console.log(response);
        getData();
        toast.success("All Task Added Successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.warn("There was a error check broser console for error");
      });
  };

  const getEditData = (data) => {
    setFormData(data);
  };

  // edit a task
  const handleUpdate = () => {
    const url = `http://localhost:5000/task/${formData._id}`;
    axios
      .put(url, {
        title: formData?.title,
        description: formData?.description,
        status: formData?.status,
        date: new Date(),
      })
      .then((response) => {
        console.log(response);
        getData();
        toast.success(response.data.message);
        setFormData({ title: "", description: "", status: "inactive" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // delete a task
  const handleDel = (id) => {
    const url = `http://localhost:5000/task/${id}`;
    axios
      .delete(url)
      .then((response) => {
        console.log(response);
        getData();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      accessorKey: "title",
      headers: "Title",
    },
    {
      accessorKey: "description",
      headers: "Description",
    },
    {
      accessorKey: "status",
      headers: "Status",
      cell: (props) => {
        switch (props.getValue()) {
          case "active":
            return (
              <p className="rounded-xl text-xs  px-2 py-0.5 text-center uppercase bg-green-500 text-white">
                {props.getValue()}
              </p>
            );
          case "inactive":
            return (
              <p className="rounded-xl text-xs  px-2 py-0.5 text-center uppercase bg-red-500 text-white">
                {props.getValue()}
              </p>
            );
          default:
            return (
              <p className="rounded-xl text-xs  px-2 py-0.5 text-center uppercase bg-gray-500 text-white">
                Invalid
              </p>
            );
        }
      },
      filterVariant: "select",
    },
    {
      accessorKey: "date",
      headers: "Date",
      cell: (props) => dayjs(props.getValue()).format("DD/MM/YYYY hh:mm:ss a "),
    },
    // {
    //   accessorKey: "createdAt",
    //   headers: "CreateAt",
    //   cell: (props) => dayjs(props.getValue()).format("DD/MM/YYYY hh:mm:ss a "),
    // },
    // {
    //   accessorKey: "updatedAt",
    //   headers: "updatedAt",
    //   cell: (props) => dayjs(props.getValue()).format("DD/MM/YYYY hh:mm:ss a "),
    // },
    {
      // accessorKey: "",
      headers: "Action",
      id: "action",
      cell: ({ row }) => (
        <div>
          <button
            className="bg-gray-500 text-white px-2 py-0.5"
            onClick={() => {
              getEditData(row.original);
              setIsmultiInput(false);
            }}
          >
            edit
          </button>
          <button
            className="bg-red-500 text-white px-2 py-0.5"
            onClick={() => handleDel(row.original._id)}
          >
            Del
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-10">
      <div id="header">
        {isMultiInput ? (
          <div>
            <div className="flex justify-between">
              <button
                onClick={() =>
                  setFormDatas([
                    ...formDatas,
                    {
                      title: "",
                      description: "",
                      status: "inactive",
                    },
                  ])
                }
                className=" px-5 py-1 rounded bg-cyan-500 text-white"
              >
                Add
              </button>
              <button
                onClick={handleMultiAdd}
                className=" px-5 py-1 rounded bg-blue-500 text-white"
              >
                Submit Multi
              </button>
            </div>
            {formDatas?.map((taskItem, taskIndex) => (
              <div key={taskIndex} className="m-5 flex gap-4 items-end">
                <div>
                  <label htmlFor="title" className="block text-gray-500 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="border rounded px-2 py-1"
                    placeholder="Enter a Task"
                    value={taskItem.title}
                    onChange={(e) =>
                      handleMultiFormChange(taskIndex, "title", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-gray-500 mb-1"
                  >
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    className="border rounded px-2 py-1"
                    placeholder="descripe your task"
                    value={taskItem.description}
                    onChange={(e) =>
                      handleMultiFormChange(
                        taskIndex,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-gray-500 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    className="border rounded px-2 py-1"
                    placeholder="Enter a Task"
                    value={taskItem.status}
                    onChange={(e) =>
                      handleMultiFormChange(taskIndex, "status", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select a value
                    </option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="m-5 flex flex-col gap-4">
            <div>
              <label htmlFor="title" className="block text-gray-500 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                className="border rounded px-2 py-1"
                placeholder="Enter a Task"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-gray-500 mb-1">
                Description
              </label>
              <textarea
                name="description"
                className="border rounded px-2 py-1"
                placeholder="Enter a Task"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
            </div>

            <div>
              <label htmlFor="status" className="block text-gray-500 mb-1">
                Status
              </label>
              <select
                name="status"
                className="border rounded px-2 py-1"
                placeholder="Enter a Task"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="" disabled>
                  Select a value
                </option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <button
                onClick={formData?._id ? handleUpdate : handleAdd}
                className=" px-5 py-1 rounded bg-blue-500 text-white"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
      {/* swicth */}
      <div className="flex gap-4 items-center ml-5">
        <input
          type="checkbox"
          className="w-8 h-8 cursor-pointer"
          onChange={() => setIsmultiInput(!isMultiInput)}
        />
        <label htmlFor="">
          {!isMultiInput ? "Multitple Input" : "Single Input"}
        </label>
      </div>
      <CustomTable data={data} columns={columns} enableSorting />
    </div>
  );
}

export default Home;
