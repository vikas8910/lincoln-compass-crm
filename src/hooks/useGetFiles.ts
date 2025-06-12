import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { UseFilesResponse, UseFilesInput } from "@/types/filtes";
import { files } from "@/data/data";

const getAllFilesFn = async ({
  pagination,
  sorting,
  columnFilters,
}: UseFilesInput): Promise<UseFilesResponse> => {
  // set pagination
  const page = pagination.pageIndex,
    per_page = pagination.pageSize;

  // set filter
  let status = "";
  let title = "";
  let description = "";
  let taskType = "";
  let outcome = "";

  for (const filter of columnFilters) {
    const id = filter.id,
      value = filter.value;
    switch (id) {
      case "statusFilter":
        status = value as string;
        break;
      case "title":
        title = value as string;
        break;
      case "description":
        description = value as string;
        break;
      case "taskType":
        taskType = value as string;
        break;
      case "outcome":
        outcome = value as string;
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
  if (title) queryParams.append("search", title);
  if (description) queryParams.append("search", description);

  // Add filter parameters
  if (taskType) queryParams.append("taskType", taskType);
  if (outcome) queryParams.append("outcome", outcome);

  // Add status filter for tabs
  if (status) {
    queryParams.append("statusFilter", status.toUpperCase());
  }

  // Add sorting parameter
  if (sorting_param) queryParams.append("sortBy", sorting_param);

  // Add pagination parameters
  queryParams.append("page", page.toString());
  queryParams.append("size", per_page.toString());

  // const res = await axiosInstance.get("/api/tasks");
  // const res = await axiosInstance.get(`/api/tasks?${queryParams.toString()}`);

  // const data = {
  //   data: res.data.tasks,
  //   limit: res.data.page.size,
  //   page: res.data.page.number,
  //   total: res.data.page.totalElements,
  //   total_filtered: res.data.page.totalElements,
  //   allCount: res.data.allCount,
  //   upcomingCount: res.data.upcomingCount,
  //   completedCount: res.data.completedCount,
  //   overdueCount: res.data.overdueCount,
  //   appliedFilters: res?.data?.appliedFilters || {},
  // };

  const data = {
    data: files,
    limit: 20,
    page: 0,
    total: 10,
    total_filtered: 10,
    appliedFilters: {},
  };

  return data;
};

export const useGetFiles = ({
  pagination,
  sorting,
  columnFilters,
}: UseFilesInput) => {
  const [allUsersData, setAllUsersData] = useState<UseFilesResponse | null>(
    null
  );
  const [isAllUsersDataLoading, setIsAllUsersDataLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [allUsersDataStatus, setAllUsersDataStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsAllUsersDataLoading(true);
        setAllUsersDataStatus("loading");
        setError(null);

        const data = await getAllFilesFn({
          pagination,
          sorting,
          columnFilters,
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

    fetchTasks();
  }, [
    // Stringify objects to prevent unnecessary re-renders
    JSON.stringify(sorting),
    JSON.stringify(columnFilters),
    JSON.stringify(pagination),
  ]);

  // Optional: Function to manually refetch data
  const refetch = () => {
    const fetchTasks = async () => {
      try {
        setIsAllUsersDataLoading(true);
        setAllUsersDataStatus("loading");
        setError(null);

        const data = await getAllFilesFn({
          pagination,
          sorting,
          columnFilters,
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

    fetchTasks();
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
