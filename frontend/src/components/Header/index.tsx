import { Link } from 'react-router-dom';
import Button from '../Button';

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-poppins-bold text-blue-600">
            StudyTrack
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="#" className="font-poppins text-slate-700 hover:text-blue-600">
              Get Started
            </Link>
            <Link to="#" className="font-poppins text-slate-700 hover:text-blue-600">
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex gap-4">
          <Link to="#" className="font-manrope text-slate-700 hover:text-blue-600 px-4 py-2 rounded-md">
            Login
          </Link>
          <Button>Registrar</Button>
        </div>
      </div>
    </header>
  );
}

export default Header;