import React, { useCallback, useState } from "react";
import { Search } from "react-feather";
import { debounce } from "lodash/fp";

const SearchInput = ({
  placeholder,
  handleSearch,
}: {
  placeholder: string;
  handleSearch: (v: string) => void;
}) => {
  const delayedQuery = useCallback(
    debounce(1000)((newValue) => handleSearch(newValue)),
    []
  );
  const onChange = (e) => {
    delayedQuery(e.target.value);
  };

  return (
    <div
      className="w-full relative justify-center items-center flex "
      style={{ maxWidth: 300 }}
    >
      <div className="w-full py-4 absolute left-2 pointer-events-none">
        <Search
          className="stroke-current text-repod-text-secondary"
          size={24}
        />
      </div>
      <input
        className={`w-full text-lg pl-10 pr-8 h-12 border-2 font-semibold rounded border-repod-border-light text-repod-text-primary focus:border-info`}
        type="search"
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;
