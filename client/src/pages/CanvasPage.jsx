import Canvas from "../components/Canvas";
import Toolbar from "../components/Toolbar";
import Topbar from "../components/Topbar";

const CanvasPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <Topbar />
      <div className="flex flex-1">
        <Toolbar />
        <Canvas />
      </div>
    </div>
  );
};

export default CanvasPage;