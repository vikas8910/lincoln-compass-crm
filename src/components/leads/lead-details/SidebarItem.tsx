import { SidebarItemProps } from "@/types/lead";

export const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  label,
  isActive,
  onClick,
  Icon,
}) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full text-left flex items-center gap-5 px-4 py-3 text-sm font-normal relative transition-colors ${
      isActive
        ? "text-black bg-white shadow-md"
        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
    }`}
  >
    {isActive && (
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r" />
    )}
    <Icon />
    {label}
  </button>
);
