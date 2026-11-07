import React from "react";
import { FaHeadphones, FaWineBottle } from "react-icons/fa6";
import { GiLipstick, GiLiquidSoap } from "react-icons/gi";
import { LuApple, LuBaby, LuRadioReceiver, LuShirt } from "react-icons/lu";
import { AiOutlineShopping } from "react-icons/ai";
import { BsPhone } from "react-icons/bs";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { CgGym } from "react-icons/cg";
import {
  MdCardGiftcard,
  MdFastfood,
  MdHealthAndSafety,
  MdIcecream,
  MdKitchen,
  MdMedication,
  MdOutlineChair,
} from "react-icons/md";

export interface StoreCategory {
  value: string;
  label: string;
  aliases?: string[];
  renderIcon: (className?: string) => React.ReactNode;
}

export const STORE_CATEGORIES: StoreCategory[] = [
  {
    value: "computers",
    label: "Computers",
    renderIcon: (cls = "text-Storepurple") => <HiOutlineDesktopComputer size={20} className={cls} />,
  },
  {
    value: "electronics",
    label: "Electronics",
    renderIcon: (cls = "text-Storepurple") => <LuRadioReceiver size={18} className={cls} />,
  },
  {
    value: "phones",
    label: "Phone & Tablets",
    aliases: ["phones", "phone"],
    renderIcon: (cls = "text-Storepurple") => <BsPhone size={18} className={cls} />,
  },
  {
    value: "accessories",
    label: "Accessories",
    renderIcon: (cls = "text-Storepurple") => <FaHeadphones size={18} className={cls} />,
  },
  {
    value: "groceries",
    label: "Groceries",
    renderIcon: (cls = "text-Storepurple") => <AiOutlineShopping size={18} className={cls} />,
  },
  {
    value: "household",
    label: "Household",
    renderIcon: (cls = "text-Storepurple") => <MdOutlineChair size={18} className={cls} />,
  },
  {
    value: "kitchen",
    label: "Kitchen utensils",
    renderIcon: (cls = "text-Storepurple") => <MdKitchen size={18} className={cls} />,
  },
  {
    value: "fashion",
    label: "Fashion",
    renderIcon: (cls = "text-Storepurple") => <LuShirt size={18} className={cls} />,
  },
  {
    value: "sports",
    label: "Sports",
    aliases: ["sports", "sport"],
    renderIcon: (cls = "text-Storepurple") => <CgGym size={18} className={cls} />,
  },
  {
    value: "food",
    label: "Food",
    renderIcon: (cls = "text-Storepurple") => <LuApple size={18} className={cls} />,
  },
  {
    value: "yoghurt",
    label: "Yoghurt",
    renderIcon: (cls = "text-Storepurple") => <MdIcecream size={18} className={cls} />,
  },
  {
    value: "snacks",
    label: "Snacks",
    renderIcon: (cls = "text-Storepurple") => <MdFastfood size={18} className={cls} />,
  },
  {
    value: "wine",
    label: "Wines & Drinks",
    renderIcon: (cls = "text-Storepurple") => <FaWineBottle size={18} className={cls} />,
  },
  {
    value: "body_care",
    label: "Body Care",
    aliases: ["body_care", "body"],
    renderIcon: (cls = "text-Storepurple") => <GiLiquidSoap size={18} className={cls} />,
  },
  {
    value: "cosmetics",
    label: "Cosmetics",
    renderIcon: (cls = "text-Storepurple") => <GiLipstick size={18} className={cls} />,
  },
  {
    value: "baby",
    label: "Baby",
    renderIcon: (cls = "text-Storepurple") => <LuBaby size={18} className={cls} />,
  },
  {
    value: "health",
    label: "Health",
    renderIcon: (cls = "text-Storepurple") => <MdHealthAndSafety size={18} className={cls} />,
  },
  {
    value: "medicine",
    label: "Medicine",
    renderIcon: (cls = "text-Storepurple") => <MdMedication size={18} className={cls} />,
  },
  {
    value: "gifts",
    label: "Gift items",
    renderIcon: (cls = "text-Storepurple") => <MdCardGiftcard size={18} className={cls} />,
  },
];

export const CATEGORY_SELECT_OPTIONS = STORE_CATEGORIES.map((c) => ({
  value: c.value,
  label: c.label,
}));

export function findCategoryBySlug(slug: string | null | undefined): StoreCategory | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return STORE_CATEGORIES.find(
    (c) => c.value === normalized || (c.aliases && c.aliases.includes(normalized))
  );
}

export function getCategoryQuerySlugs(slug: string): string[] {
  const match = findCategoryBySlug(slug);
  if (match) {
    return match.aliases ?? [match.value];
  }
  return [slug];
}

export function getCategoryDisplayLabel(slug: string): string {
  const match = findCategoryBySlug(slug);
  return match ? match.label : slug;
}
