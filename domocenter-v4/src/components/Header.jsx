function Header() {
  return (
    <header
      style={{
        background: "#1f2937",
        color: "white",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h1 style={{ margin: 0 }}>🏠 DomoCenter</h1>
        <small>Centre de contrôle domotique</small>
      </div>

      <div style={{ fontSize: "24px" }}>
        🔔 ⚙️ 👤
      </div>
    </header>
  );
}

export default Header;
