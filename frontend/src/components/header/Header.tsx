import "./Header.css";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div className="header">
      <h1 className="header_text">
        {"Add your files containing the candidates emails"}
      </h1>
    </div>
  );
};

export default Header;
