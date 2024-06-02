/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Button from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Users = () => {
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/bulk?filter=" + filter, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUsers(response.data.users);
      });
  }, [filter]);

  if (users.length === 0) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>
      <div>
        {users.map((user) => (
          <User key={user._id} user={user} />
        ))}
      </div>
    </>
  );
};

// eslint-disable-next-line react/prop-types
function User({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {user.first_name[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
          <div>
            {user.first_name} {user.last_name}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-ful">
        <Button
          onClick={() => {
            navigate("/sendmoney?id=" + user._id + "&name=" + user.first_name);
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}

export default Users;
