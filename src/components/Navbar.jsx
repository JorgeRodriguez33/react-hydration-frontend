import { useAuthStore } from "../hooks/useAuthStore";

export const Navbar = () => {

    const{startLogout,user} = useAuthStore();

  return (
    <div className="navbar navbar-dark bg-dark px-4">
      <span className="navbar-brand">
        <i className="fa fa-truck"></i>
        {/* &nbsp; es para hacer un espacio */}
        &nbsp; {user.name}
      </span>

      <button className="btn btn-outline-danger" onClick={startLogout}>
        <i className="fas fa-sign-out-alt"></i>
        <span>Salir</span>
      </button>
    </div>
  );
};
