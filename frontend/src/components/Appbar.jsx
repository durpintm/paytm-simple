import { useNavigate } from "react-router-dom";

const Appbar = () => {
  const navigate = useNavigate();
  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">PayTM App</div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">Hello</div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">U</div>
        </div>
        <div className="flex flex-col justify-center mr-4">
          <button
            className="bg-slate-600 text-white p-2 rounded-lg hover:bg-slate-800"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appbar;
