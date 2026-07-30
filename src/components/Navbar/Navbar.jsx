function Navbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "#1a1a1a",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        borderBottom: "1px solid #333",
      }}
    >
      <h2 style={{ color: "#FFD700" }}>Dashboard</h2>

      <div style={{ color: "#fff" }}>
        Welcome, <b style={{ color: "#FFD700" }}>Admin</b>
      </div>
    </div>
  );
}

export default Navbar;