import type { LoaderArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { lazy, Suspense } from "react";
import { ClientOnly } from "remix-utils";
const Preview = lazy(() => import("~/features/preview"));

export function loader({ params }: LoaderArgs) {
  invariant(params.id);
  return params.id;
}

function Route() {
  const id = useLoaderData<typeof loader>();

  return (
    <ClientOnly>
      {() => (
        <Suspense>
          <Preview file={id} />
        </Suspense>
      )}
    </ClientOnly>
  );
}

export default Route;
