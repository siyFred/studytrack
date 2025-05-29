const Footer = () => {
  return (
    <footer className="w-full bg-slate-100 py-4">
      <div className="max-w-7xl mx-auto text-center text-slate-500 font-manrope">
        © {new Date().getFullYear()} StudyTrack. Todos os direitos reservados.
      </div>
    </footer>
  );
}

export default Footer;