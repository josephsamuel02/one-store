/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from "react-select";

const CategoryNav = () => {
  const categoryOptions: any = [
    { value: "/category?category=computers", label: "computers" },
    { value: "/category?category=accessories", label: "accessories" },
    { value: "/category?category=groceries", label: "groceries" },
    { value: "/category?category=fashion", label: "fashion" },
    { value: "/category?category=electronics", label: "electronics" },
    { value: "/category?category=sports", label: "sports" },
    { value: "/category?category=food", label: "food" },
    { value: "/category?category=cosmetics", label: "cosmetics" },
    { value: "/category?category=wine", label: "Wine" },
    { value: "/category?category=household", label: "household" },
    { value: "/category?category=health", label: "Health" },
    { value: "/category?category=gifts", label: "Gift items" },
    { value: "/category?category=kitchen", label: "Kitchen utensils" },
    { value: "/category?category=yoghurt", label: "Yoghurt" },
    { value: "/category?category=snacks", label: "Snacks" },
    { value: "/category?category=medicine", label: "Medicine" },
  ];
  return (
    <div className="mx-auto py-3 w-full h-auto bg-white px-4 flex flex-row rounded">
      <div className=" py-1 flex flex-col  items-center ">
        <Select
          options={categoryOptions}
          defaultValue="categories"
          placeholder="categories"
          onChange={(e: any) => window.location.replace(e.value)}
          className="w-52"
        />
      </div>
    </div>
  );
};

export default CategoryNav;
