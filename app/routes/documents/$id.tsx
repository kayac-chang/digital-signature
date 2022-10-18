import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

export function loader({ params }: LoaderArgs) {
  invariant(params.id);

  return json({ id: params.id });
}

function Route() {
  const { id } = useLoaderData<typeof loader>();
  return <>{id}</>;
}

export default Route;
