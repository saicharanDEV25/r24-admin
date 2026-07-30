import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";

function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, background: "#111" }}>
        <Navbar />

        <div style={{ padding: "25px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;