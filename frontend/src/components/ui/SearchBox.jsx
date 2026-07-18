import { Search } from "lucide-react";

const SearchBox = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative w-full md:w-80">

      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
      />

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
      />

    </div>
  );
};

export default SearchBox;