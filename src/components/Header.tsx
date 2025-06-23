
const Header = () => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center">
        {/* Desktop Logo */}
        <div className="hidden md:block">
          <img 
            src="/lovable-uploads/44e5666c-3c36-428a-bacb-695c58658b69.png" 
            alt="E-CARGO" 
            className="h-8"
          />
        </div>
        
        {/* Mobile Logo */}
        <div className="block md:hidden">
          <img 
            src="/lovable-uploads/9eb5a8d8-bf72-45b2-aa8d-d15d1999565f.png" 
            alt="E-CARGO" 
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
