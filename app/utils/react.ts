type PromiseState = "initial" | "pending" | "success" | "error";

export function wrapForSuspense<Task extends (...args: any[]) => Promise<any>>(
  task: Task
) {
  let status: PromiseState = "initial";
  let result: Awaited<ReturnType<Task>>;
  let suspend: Promise<void>;

  return (...args: Parameters<Task>) => {
    if (status === "initial") {
      status = "pending";
      suspend = task(...args)
        .then((res) => {
          status = "success";
          result = res;
        })
        .catch((err) => {
          status = "error";
          result = err;
        });
    }
    if (status === "pending") {
      throw suspend;
    }
    if (status === "error") {
      throw result;
    }
    return result;
  };
}
