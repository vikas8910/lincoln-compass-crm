import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import axiosInstance from "@/services/axios/axios-base-service";
import { LEADS } from "@/lib/api-endpoints";
import { UseLeadsResponse, UseUsersInput } from "@/types/lead";

const getAllUsersFn = async ({
  sorting,
  columnFilters,
  pagination,
}: UseUsersInput): Promise<UseLeadsResponse> => {
  // set pagination
  const page = pagination.pageIndex,
    per_page = pagination.pageSize;

  // set filter
  let email = "",
    firstName = "",
    lastName = "",
    phone = "",
    source = "",
    course = "",
    leadType = "",
    assignedTo = "";

  for (const filter of columnFilters) {
    const id = filter.id,
      value = filter.value;
    switch (id) {
      case "firstName":
        firstName = value as string;
        break;
      case "lastName":
        lastName = value as string;
        break;
      case "email":
        email = value as string;
        break;
      case "phone":
        phone = value as string;
        break;
      case "source":
        source = value as string;
        break;
      case "course":
        course = value as string;
        break;
      case "leadType":
        leadType = value as string;
        break;
      case "assignedTo":
        assignedTo = value as string;
        break;
    }
  }

  // set sorting
  let sorting_param = "";
  for (let i = 0; i < sorting.length; i++) {
    const id = sorting[i].id,
      direction = sorting[i].desc ? "desc" : "asc";
    sorting_param += id + ":" + direction;
    if (i !== sorting.length - 1) {
      sorting_param += ",";
    }
  }

  // Build query string
  const queryParams = new URLSearchParams();

  // Add search parameters
  if (firstName) queryParams.append("search", firstName);
  if (lastName) queryParams.append("search", lastName);
  if (email) queryParams.append("search", email);
  if (phone) queryParams.append("search", phone);

  // Add filter parameters
  if (source) queryParams.append("source", source);
  if (course) queryParams.append("course", course);
  if (leadType) queryParams.append("leadType", leadType);

  // Add sortedBy parameter for My Leads tab
  if (assignedTo === "sortedBy") {
    queryParams.append("sortedBy", "assignedTo");
  }

  // Add sorting parameter
  if (sorting_param) queryParams.append("sortBy", sorting_param);

  // Add pagination parameters
  queryParams.append("page", page.toString());
  queryParams.append("size", per_page.toString());

  const res = await axiosInstance.get(`${LEADS}?${queryParams.toString()}`);

  const data = {
    data: res.data.content,
    limit: res.data.page.size,
    page: res.data.page.number,
    total: res.data.page.totalElements,
    total_filtered: 11,
    appliedFilters: res.data.appliedFilters || {}, // Add applied filters from API response
  };

  return data;
};

export const useGetLeads = ({
  sorting,
  columnFilters,
  pagination,
}: UseUsersInput) => {
  const [allUsersData, setAllUsersData] = useState<UseLeadsResponse | null>(
    null
  );
  const [isAllUsersDataLoading, setIsAllUsersDataLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [allUsersDataStatus, setAllUsersDataStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsAllUsersDataLoading(true);
        setAllUsersDataStatus("loading");
        setError(null);

        const data = await getAllUsersFn({
          sorting,
          columnFilters,
          pagination,
        });

        setAllUsersData(data);
        setAllUsersDataStatus("success");
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        setAllUsersDataStatus("error");
      } finally {
        setIsAllUsersDataLoading(false);
      }
    };

    fetchUsers();
  }, [
    // Stringify objects to prevent unnecessary re-renders
    JSON.stringify(sorting),
    JSON.stringify(columnFilters),
    JSON.stringify(pagination),
  ]);

  // Optional: Function to manually refetch data
  const refetch = () => {
    const fetchUsers = async () => {
      try {
        setIsAllUsersDataLoading(true);
        setAllUsersDataStatus("loading");
        setError(null);

        const data = await getAllUsersFn({
          sorting,
          columnFilters,
          pagination,
        });

        setAllUsersData(data);
        setAllUsersDataStatus("success");
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        setAllUsersDataStatus("error");
      } finally {
        setIsAllUsersDataLoading(false);
      }
    };

    fetchUsers();
  };

  return {
    allUsersData,
    allUsersDataStatus,
    isAllUsersDataLoading,
    error,
    refetch,
    appliedFilters: allUsersData?.appliedFilters || {}, // Return applied filters
  };
};
