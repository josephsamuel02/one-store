/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "react-select";
import ROUTES from "../../utils/Routes";
import { STORE_CATEGORIES } from "../../utils/categories";

const CategoryNav = () => {
  const categoryOptions = STORE_CATEGORIES.map((c) => ({
    value: `${ROUTES.CATEGORY}?category=${c.value}`,
    label: c.label,
  }));

  return (
    <div className="mx-auto py-3 w-full h-auto bg-white px-4 flex flex-row rounded">
      <div className="py-1 flex flex-col items-center">
        <Select
          options={categoryOptions}
          placeholder="Categories"
          onChange={(e: any) => {
            if (e?.value) window.location.replace(e.value);
          }}
          className="w-56"
        />
      </div>
    </div>
  );
};

export default CategoryNav;
