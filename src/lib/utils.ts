import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (
  dateString: string | null | undefined
): string => {
  if (!dateString) {
    return "N/A";
  }

  try {
    // Create Date object from the ISO string
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Format the date using Intl.DateTimeFormat
    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

export const formatDateOnly = (
  dateString: string | null | undefined
): string => {
  if (!dateString) {
    return "N/A";
  }

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

export const formatRelativeTime = (
  dateString: string | null | undefined
): string => {
  if (!dateString) {
    return "N/A";
  }

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Less than a minute
    if (diffInSeconds < 60) {
      return "Just now";
    }

    // Less than an hour
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    // Less than a day
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    // Less than a week
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    // Fall back to formatted date for older dates
    return formatDateTime(dateString);
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Invalid Date";
  }
};

export const getAvatarColors = (letter: string) => {
  const colorMap: Record<string, { bg: string; text: string }> = {
    A: { bg: "bg-[#fee2e2]", text: "text-[#dc2626]" }, // Light red bg, dark red text
    B: { bg: "bg-[#dbeafe]", text: "text-[#2563eb]" }, // Light blue bg, dark blue text
    C: { bg: "bg-[#dcfce7]", text: "text-[#16a34a]" }, // Light green bg, dark green text
    D: { bg: "bg-[#f3e8ff]", text: "text-[#9333ea]" }, // Light purple bg, dark purple text
    E: { bg: "bg-[#fce7f3]", text: "text-[#ec4899]" }, // Light pink bg, dark pink text
    F: { bg: "bg-[#e0e7ff]", text: "text-[#4f46e5]" }, // Light indigo bg, dark indigo text
    G: { bg: "bg-[#fed7aa]", text: "text-[#ea580c]" }, // Light orange bg, dark orange text
    H: { bg: "bg-[#ccfbf1]", text: "text-[#0d9488]" }, // Light teal bg, dark teal text
    I: { bg: "bg-[#cffafe]", text: "text-[#0891b2]" }, // Light cyan bg, dark cyan text
    J: { bg: "bg-[#d1fae5]", text: "text-[#059669]" }, // Light emerald bg, dark emerald text
    K: { bg: "bg-[#ede9fe]", text: "text-[#8b5cf6]" }, // Light violet bg, dark violet text
    L: { bg: "bg-[#ffe4e6]", text: "text-[#f43f5e]" }, // Light rose bg, dark rose text
    M: { bg: "bg-[#fef3c7]", text: "text-[#d97706]" }, // Light amber bg, dark amber text
    N: { bg: "bg-[#ecfccb]", text: "text-[#65a30d]" }, // Light lime bg, dark lime text
    O: { bg: "bg-[#e0f2fe]", text: "text-[#0284c7]" }, // Light sky bg, dark sky text
    P: { bg: "bg-[#fdf4ff]", text: "text-[#c026d3]" }, // Light fuchsia bg, dark fuchsia text
    Q: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" }, // Light slate bg, dark slate text
    R: { bg: "bg-[#fef2f2]", text: "text-[#b91c1c]" }, // Light red bg, darker red text
    S: { bg: "bg-[#f6f0a7]", text: "text-[#d1a805]" }, // Your custom yellow combination
    T: { bg: "bg-[#ddd6fe]", text: "text-[#7c3aed]" }, // Light blue-purple bg, dark purple text
    U: { bg: "bg-[#bbf7d0]", text: "text-[#047857]" }, // Light mint bg, dark green text
    V: { bg: "bg-[#e9d5ff]", text: "text-[#7c2d12]" }, // Light lavender bg, brown text
    W: { bg: "bg-[#fbcfe8]", text: "text-[#be185d]" }, // Light pink bg, dark pink text
    X: { bg: "bg-[#c7d2fe]", text: "text-[#3730a3]" }, // Light indigo bg, dark indigo text
    Y: { bg: "bg-[#fed7aa]", text: "text-[#c2410c]" }, // Light peach bg, dark orange text
    Z: { bg: "bg-[#a7f3d0]", text: "text-[#065f46]" }, // Light teal bg, dark teal text
  };

  const upperLetter = letter?.toUpperCase();
  return (
    colorMap[upperLetter] || { bg: "bg-[#f3f4f6]", text: "text-[#374151]" }
  );
};

export const getNestedValue = (obj, path) => {
  return path.split(".").reduce((current, key) => current?.[key], obj);
};

export const buildSocialMediaUrl = (
  input: string | undefined,
  platform: string
): string | null => {
  if (!input) return null;

  const trimmedInput = input.trim();

  // If it's already a full URL, return it
  if (
    trimmedInput.startsWith("http://") ||
    trimmedInput.startsWith("https://")
  ) {
    return trimmedInput;
  }

  // Remove @ symbol if present (common for usernames)
  const username = trimmedInput.replace(/^@/, "");

  // Build URL based on platform
  switch (platform.toLowerCase()) {
    case "facebook":
      return `https://facebook.com/${username}`;
    case "twitter":
      return `https://twitter.com/${username}`;
    case "linkedin":
      // LinkedIn profiles can be /in/username or /company/companyname
      // Default to personal profile format
      if (username.startsWith("company/") || username.startsWith("in/")) {
        return `https://linkedin.com/${username}`;
      }
      return `https://linkedin.com/in/${username}`;
    default:
      return null;
  }
};
